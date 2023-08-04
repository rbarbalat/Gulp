from flask import Blueprint, jsonify, request
from flask_login import current_user
from app.api.aws import get_unique_filename, upload_file_to_s3, remove_file_from_s3
from app.models import db, User, Business, Review, BusImage, RevImage, Favorite
from app.forms.bus_form import BusForm
from app.forms.edit_bus_form import EditBusForm
from app.forms.review_form import ReviewForm
from sqlalchemy import or_, func

from datetime import datetime

bus_routes = Blueprint("businesses", __name__)

#GET ALL BUSINESSES
@bus_routes.route("/")
def get_all_businesses():
    """
    This route returns an array of business dictionairies for all business in the db
    """
    # gets the val of the name key in the dict if it exists, otherwise sets key equal to "tags"
    name = request.args.get("name")
    if not name:
        tags = list(request.args.values())

    if name:
        all_bus = Business.query.filter( \
            # func.lower(Business.name) == name
            func.lower(Business.name).contains(name)
        )
    elif tags:
        all_bus = Business.query.filter( \
            or_(
                func.lower(Business.tag_one).in_(tags),
                func.lower(Business.tag_two).in_(tags),
                func.lower(Business.tag_three).in_(tags)
            )
        )
    else:
        all_bus = Business.query.all()

    if not all_bus:
        return [], 200

    lst = []
    for bus in all_bus:
        images = [image.to_dict() for image in bus.images]
        # reviews = [review.to_dict() for review in bus.bus_reviews]
        average = [review.rating for review in bus.bus_reviews]
        numReviews = len(average)
        if len(average) == 0:
            average = None
        else:
            average = sum(average)/len(average)
        lst.append({
            **bus.to_dict(),
            "owner": bus.owner.to_dict(),
            "average": average,
            "numReviews": numReviews,
            "images": images
            # "reviews": reviews
        })
    return lst, 200

#GET Business by Id
@bus_routes.route("/<int:id>")
def get_business_by_id(id):

    """
    Returns a dictionary of a business specified by id with extra image and reviews keys
    which are arrays of review and image dictionaries
    """

    bus = Business.query.get(id)
    if not bus:
        return {"error": "Business not found"}, 404

    images = [image.to_dict() for image in bus.images]
    # reviews = [review.to_dict() for review in bus.bus_reviews]
    # need to add image info and reviewer info to the reviews key!

    reviews = []
    reviewers = []
    for review in bus.bus_reviews:
        reviewers.append(review.reviewer_id)
        rev_images = [image.to_dict() for image in review.images]
        reviews.append({
           **review.to_dict(),
           "images": rev_images,
           "reviewer": {
               **review.reviewer.to_dict(),
                "numReviews": len(review.reviewer.user_reviews)
               },
            "replies": [reply.to_dict() for reply in review.replies]
        })

    average = [review["rating"] for review in reviews ]
    if len(average) == 0:
        average = None
    else:
        average = sum(average)/len(average)

    return {
        **bus.to_dict(),
        "owner": bus.owner.to_dict(),
        "reviews": reviews,
        "images": images,
        "numReviews": len(reviews),
        "average": average,
        "reviewers": reviewers
    }, 200

#GET ALL BUSINESSES BY CURRENT USER
@bus_routes.route("/current")
def get_all_businesses_by_current_user():
    """
    This route returns an array of dictionaries of all the businesses
    owned by the current user
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    #this is not an error, legit response
    all_bus = current_user.businesses
    if not all_bus:
        return [], 200

    lst = []
    for bus in all_bus:
        images = [image.to_dict() for image in bus.images]
        # reviews = [review.to_dict() for review in bus.bus_reviews]
        average = [review.rating for review in bus.bus_reviews]
        numReviews = len(average)
        if len(average) == 0:
            average = None
        else:
            average = sum(average)/len(average)
        lst.append({
            **bus.to_dict(),
            "owner": bus.owner.to_dict(),
            "average": average,
            "numReviews": numReviews,
            "images": images
            # "reviews": reviews
        })
    return lst, 200

#DELETE Business by Id
@bus_routes.route("/<int:id>", methods = ["DELETE"])
def delete_business_by_id(id):
    """
    Delete a single business by id
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    bus = Business.query.get(id)
    if not bus:
        return {"error": "Business not found"}, 404

    if current_user.id != bus.owner_id:
        return {"error": "not authorized"}, 403

    #remove prev.url any images bus.images from aws
    # errors = []
    # optional_urls = [image.url for image in bus.images]
    # urls = [bus.prev_url, *optional_urls]
    # for url in urls:
    #     if url: #should always be true but just in case
    #         aws = remove_file_from_s3(url)
    #         if isinstance(aws, dict):
    #             errors.append(aws["errors"])

    db.session.delete(bus)
    db.session.commit()
    return {"message": "Successfully deleted the business"}

    # if not errors:
    #     return {"message": "Successfully deleted the business"}
    # else:
    #     return {
    #         "message": "Successfully deleted but have AWS errors",
    #         "errors": errors
    #     }


#CREATE A BUSINESS
@bus_routes.route("/", methods = ["POST"])
def create_business():
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    form = BusForm()
    #form["csrf_token"].data = request.cookies.get("csrf_token")
    if "csrf_token" in request.cookies:
        form["csrf_token"].data = request.cookies["csrf_token"]
    else:
        return {"error": "Missing csrf_token"}, 404
        # check this error code

    if form.validate_on_submit():
        prev_url = form.data["prev_url"]
        prev_url.filename = get_unique_filename(prev_url.filename)
        upload = upload_file_to_s3(prev_url)

        # these keys come from the field names in the form
        keys = ["first", "second", "third"]
        optional_uploads = []
        for key in keys:
            #key in form.data always True but form.data[key] can be None
            if form.data[key]:
                val = form.data[key]
                val.filename = get_unique_filename(val.filename)
                optional_upload = upload_file_to_s3(val)
                if "url" in optional_upload:
                    optional_uploads.append(optional_upload)

        bus = Business()
        if "url" in upload:
            bus.prev_url = upload["url"]

        bus.owner_id = current_user.id
        bus.name = form.data["name"]
        bus.description = form.data["description"]
        bus.address = form.data["address"]
        bus.city = form.data["city"]
        bus.state = form.data["state"]

        bus.tag_one = form.data["tag_one"]
        bus.tag_two = form.data["tag_two"]
        bus.tag_three = form.data["tag_three"]

        bus.created_at = datetime.now()

        db.session.add(bus)
        db.session.commit()

        images = [ BusImage(business = bus, url = optional_upload["url"])
            for optional_upload in optional_uploads ]

        _ = [db.session.add(image) for image in images]
        db.session.commit()
        images = [image.to_dict() for image in images]

        return {
            **bus.to_dict(),
            "images": images,
            "owner": current_user.to_dict(),
            "reviews": [],
            "numReviews": 0,
            "average": None
            #if owner is necessary
        }, 201

    print("printing form.errors")
    print(form.errors)
    return {"error": form.errors}, 400

#EDIT A BUSINESS
@bus_routes.route("/<int:id>", methods = ["PUT"])
def edit_business(id):
    if not current_user.is_authenticated:
        return {"error": "Not authenticated"}, 401

    bus = Business.query.get(id)

    if not bus:
        return {"error": "Business not found"}, 404

    if current_user.id != bus.owner_id:
        return {"error": "Not authorized"}, 403

    form = EditBusForm()
    #form["csrf_token"].data = request.cookies.get("csrf_token")
    if "csrf_token" in request.cookies:
        form["csrf_token"].data = request.cookies["csrf_token"]
    else:
        return {"error": "Missing csrf_token"}, 404
        # check this error code

    if form.validate_on_submit():
        # not using the name_exists validator in the edit_form so need this adjustment here
        # can use .first b/c the name col has a unique constraint, can't be more than one
        same_name_bus = Business.query.filter(Business.name == form.data["name"]).first()
        if same_name_bus and same_name_bus.id != bus.id:
            return {
                "error": {
                    "name": ["Business name is already in use"]
                }
            }
        # make this error message match the structure of others
        bus.name = form.data["name"]
        bus.description = form.data["description"]
        bus.address = form.data["address"]
        bus.city = form.data["city"]
        bus.state = form.data["state"]

        bus.tag_one = form.data["tag_one"]
        bus.tag_two = form.data["tag_two"]
        bus.tag_three = form.data["tag_three"]
        bus.updated_at = datetime.now()

        # if the user did not change the picture, the frontend sends back nothing
        if form.data["prev_url"]:
            prev_url = form.data["prev_url"]
            prev_url.filename = get_unique_filename(prev_url.filename)
            upload = upload_file_to_s3(prev_url)
            if "url" in upload:
                bus.prev_url = upload["url"]

        keys = ["first", "second", "third"]
        existing_images = bus.images
        new_urls = []
        for i in range(3):
            if form.data[keys[i]]:
                if len(existing_images) >= i + 1:
                    # url_to_remove = existing_images[i].url
                    val = form.data[keys[i]]
                    val.filename = get_unique_filename(val.filename)
                    optional_upload = upload_file_to_s3(val)
                    if "url" in optional_upload:
                        existing_images[i].url = optional_upload["url"]
                        # aws = remove_file_from_s3(url_to_remove)
                else:
                    val = form.data[keys[i]]
                    val.filename = get_unique_filename(val.filename)
                    optional_upload = upload_file_to_s3(val)
                    if "url" in optional_upload:
                        new_image = BusImage(business_id = id, url = optional_upload["url"])
                        db.session.add(new_image)
                        # db.session.add(new_image) updates bus.images but not existing_images....
                        # so the length of existing_images is fixed to the original length of bus.images
                        # meaning you don't need to db.session.commit() here

        db.session.commit()
        return {
            **bus.to_dict(),
            "images": [image.to_dict() for image in bus.images]
            # "images": images,
            # "images": retain_images
        }, 201

    return {"error": form.errors}, 400


#CREATE A REVIEW
@bus_routes.route("/<int:id>/reviews", methods = ["POST"])
def create_review(id):
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    bus = Business.query.get(id)
    if not bus:
        return {"error": "Business does not exist"}, 404

    form = ReviewForm()
    #form["csrf_token"].data = request.cookies.get("csrf_token")
    if "csrf_token" in request.cookies:
        form["csrf_token"].data = request.cookies["csrf_token"]
    else:
        return {"error": "Missing csrf_token"}, 404
        # check this error code

    if form.validate_on_submit():
        # these keys come from the field names in the form
        keys = ["first", "second", "third"]
        optional_uploads = []
        for key in keys:
            #key is always in form.data but form.data[key] can be None
            if form.data[key]:
                val = form.data[key]
                val.filename = get_unique_filename(val.filename)
                optional_upload = upload_file_to_s3(val)
                if "url" in optional_upload:
                    optional_uploads.append(optional_upload)

        review = Review()

        review.reviewer_id = current_user.id
        review.business_id = id
        review.review = form.data["review"]
        review.rating = form.data["rating"]
        review.created_at = datetime.now()

        db.session.add(review)
        db.session.commit()

        images = [ RevImage(review = review, url = optional_upload["url"])
            for optional_upload in optional_uploads ]

        _ = [db.session.add(image) for image in images]
        db.session.commit()
        images = [image.to_dict() for image in images]

        return {
            **review.to_dict(),
            "images": images,
            "reviewer": current_user.to_dict()
        }, 201

    return {"error": form.errors}, 400

#DELETE Business Image by Id
@bus_routes.route("/images/<int:id>", methods = ["DELETE"])
def delete_business_image_by_id(id):
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    image = BusImage.query.get(id)
    if not image:
        return {"error": "Image not found"}, 404

    if current_user.id != image.business.owner_id:
        return {"error": "not authorized"}, 403

    # errors = []
    # if image.url: #should always be true but just in case
    #     aws = remove_file_from_s3(image.url)
    #     if isinstance(aws, dict):
    #         errors.append(aws["errors"])

    db.session.delete(image)
    db.session.commit()

    return {"message": "Successfully deleted the business image"}

    # if not errors:
    #     return {"message": "Successfully deleted the business image"}
    # else:
    #     return {
    #         "message": f"Successfully deleted the image but have the following error {errors[0]}"
    #     }

#GET ALL FAVORITE BUSINESSES BY CURRENT USER
@bus_routes.route("/current/favorites")
def get_all_fav_businesses_by_current_user():
    """
    This route returns an array of dictionaries of all the businesses
    owned by the current user
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    #this is not an error, legit response
    all_bus = [favorite.business for favorite in current_user.favorites]
    if not all_bus:
        return [], 200

    #maybe need to add a status key recheck

    lst = []
    for bus in all_bus:
        images = [image.to_dict() for image in bus.images]
        # reviews = [review.to_dict() for review in bus.bus_reviews]
        average = [review.rating for review in bus.bus_reviews]
        numReviews = len(average)
        if len(average) == 0:
            average = None
        else:
            average = sum(average)/len(average)
        lst.append({
            **bus.to_dict(),
            "owner": bus.owner.to_dict(),
            "average": average,
            "numReviews": numReviews,
            "images": images
            # "reviews": reviews
        })
    return lst, 200

#CREATE A FAVORITE
@bus_routes.route("/<int:id>/favorites", methods = ["POST"])
def create_favorite(id):
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    bus = Business.query.get(id)
    if not bus:
        return {"error": "Business does not exist"}, 404

    if bus.id in [favorite.business_id for favorite in current_user.favorites]:
        return {"error": "User has already favorited this business"}, 400

    fav = Favorite(business_id = id, user_id = current_user.id, super = False)

    db.session.add(fav)
    db.session.commit()
    return fav.to_dict()
