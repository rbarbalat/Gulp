from flask import Blueprint, request
from flask_login import current_user
from app.api.aws import get_unique_filename, upload_file_to_s3, remove_if_not_seeded_file_from_s3
from app.models import db, User, Business, Review, BusImage, RevImage, Favorite
from app.forms.bus_form import BusForm
from app.forms.edit_bus_form import EditBusForm
from app.forms.review_form import ReviewForm
from sqlalchemy import or_, func, desc
from sqlalchemy.orm import joinedload

from datetime import datetime

bus_routes = Blueprint("businesses", __name__)

#GET ALL BUSINESSES
@bus_routes.route("/")
def get_all_businesses():
    """
    This route returns an array of business dictionairies for all business in the db if there is no query.
    If there is a query by name, will return an array of businesses whose name contains the query's value.
    If there is a query by tag(s), will return an array of businesses that match at least 1 tag.
    """
    name = request.args.get("name")
    if not name:
        tags = list(request.args.values())

    if name:
        all_bus = Business.query.filter( \
            func.lower(Business.name).contains(name)
        ).all()
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

    lst = []
    for bus in all_bus:
        images = [image.to_dict() for image in bus.images]
        average = [review.rating for review in bus.reviews]
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
        })
    return lst, 200

#GET Business by Id
@bus_routes.route("/<int:id>")
def get_business_by_id(id):

    """
    Returns a dictionary of a business specified by id with extra image and reviews keys
    which are arrays of review and image dictionaries
    """

    bus = Business.query.filter(Business.id == id).options(
                                    joinedload(Business.owner),
                                    joinedload(Business.images),
                                    joinedload(Business.reviews).options(
                                        joinedload(Review.replies),
                                        joinedload(Review.reviewer),
                                        joinedload(Review.images)
                                )).first()

    if not bus:
        return {"error": "Business not found"}, 404

    reviews = [{
                    **review.to_dict(),
                    "reviewer": {
                                    **review.reviewer.to_dict(),
                                    "numReviews": len(review.reviewer.user_reviews)
                                },
                    "replies": [reply.to_dict() for reply in review.replies],
                    "images": [image.to_dict() for image in review.images]
                }
                    for review in bus.reviews ]

    ratings = [ review["rating"] for review in reviews ]
    average = sum(ratings)/len(ratings) if ratings else None
    return {
        **bus.to_dict(),
        "owner": bus.owner.to_dict(),
        "images": [image.to_dict() for image in bus.images],
        "reviews": reviews,
        "numReviews": len(reviews),
        "average": average
    }, 200

    # bus = Business.query.get(id)
    # if not bus:
    #     return {"error": "Business not found"}, 404

    # images = [image.to_dict() for image in bus.images]


    # reviews = []
    # reviewers = []
    # for review in bus.reviews:
    #     reviewers.append(review.reviewer_id)
    #     rev_images = [image.to_dict() for image in review.images]
    #     reviews.append({
    #        **review.to_dict(),
    #        "images": rev_images,
    #        "reviewer": {
    #            **review.reviewer.to_dict(),
    #             "numReviews": len(review.reviewer.user_reviews)
    #            },
    #         "replies": [reply.to_dict() for reply in review.replies]
    #     })

    # average = [review["rating"] for review in reviews ]
    # if len(average) == 0:
    #     average = None
    # else:
    #     average = sum(average)/len(average)

    # return {
    #     **bus.to_dict(),
    #     "owner": bus.owner.to_dict(),
    #     "reviews": reviews,
    #     "images": images,
    #     "numReviews": len(reviews),
    #     "average": average,
    #     "reviewers": reviewers
    # }, 200

#GET ALL BUSINESSES BY CURRENT USER
@bus_routes.route("/current")
def get_all_businesses_by_current_user():
    """
    This route returns an array of dictionaries of all the businesses
    owned by the current user.
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    all_bus = current_user.businesses

    lst = []
    for bus in all_bus:
        images = [image.to_dict() for image in bus.images]
        average = [review.rating for review in bus.reviews]
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
        })
    return lst, 200

#GET ALL RECENT BUSINESSES
@bus_routes.route("/recent/<int:limit>")
def get_all_recent_businesses(limit):
    """
    This route returns a list of dictionaries with a max length specified by the route parameter
    of the most recently created businesses.
    """

    all_bus = Business.query.order_by(desc(Business.created_at)).limit(limit).all()

    lst = []
    for bus in all_bus:
        images = [image.to_dict() for image in bus.images]
        average = [review.rating for review in bus.reviews]
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
        })
    return lst, 200

#DELETE Business by Id
@bus_routes.route("/<int:id>", methods = ["DELETE"])
def delete_business_by_id(id):
    """
    Deletes a single business by id and also removes related business and review images from AWS.
    Returns a dictionary with a message key specifying a succesful response.
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    bus = Business.query.get(id)
    if not bus:
        return {"error": "Business not found"}, 404

    if current_user.id != bus.owner_id:
        return {"error": "not authorized"}, 403

    #remove the preview image and any optional images from AWS
    urls = [image.url for image in bus.images]
    urls.append(bus.prev_url)   # prev_url always exists (nullable = False)
    for url in urls:
        remove_if_not_seeded_file_from_s3(url)

    # deleting a business will cascade to delete all of its reviews so need to remove those images as well
    for review in bus.reviews:
        urls = [image.url for image in review.images]
        for url in urls:
            remove_if_not_seeded_file_from_s3(url)

    db.session.delete(bus)
    db.session.commit()
    return {"message": "Successfully deleted the business"}


#CREATE A BUSINESS
@bus_routes.route("/", methods = ["POST"])
def create_business():
    """
    This route creates a business and upon successful creation returns the business as a dictionary along
    with some extra keys.
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    form = BusForm()
    if "csrf_token" in request.cookies:
        form["csrf_token"].data = request.cookies["csrf_token"]
    else:
        return {"error": "Missing csrf_token"}, 403

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
        }, 201

    return {"error": form.errors}, 400

#EDIT A BUSINESS
@bus_routes.route("/<int:id>", methods = ["PUT"])
def edit_business(id):
    """
    This route edits a business and upon a successful edit returns the business as a dictionary along
    with a key for the optional images.
    """
    if not current_user.is_authenticated:
        return {"error": "Not authenticated"}, 401

    bus = Business.query.get(id)

    if not bus:
        return {"error": "Business not found"}, 404

    if current_user.id != bus.owner_id:
        return {"error": "Not authorized"}, 403

    form = EditBusForm()
    if "csrf_token" in request.cookies:
        form["csrf_token"].data = request.cookies["csrf_token"]
    else:
        return {"error": "Missing csrf_token"}, 403

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
                remove_if_not_seeded_file_from_s3(bus.prev_url)
                bus.prev_url = upload["url"]

        keys = ["first", "second", "third"]
        existing_images = bus.images
        for i in range(3):
            if form.data[keys[i]]:
                if len(existing_images) >= i + 1:
                    url_to_remove = existing_images[i].url
                    val = form.data[keys[i]]
                    val.filename = get_unique_filename(val.filename)
                    optional_upload = upload_file_to_s3(val)
                    if "url" in optional_upload:
                        existing_images[i].url = optional_upload["url"]
                        remove_if_not_seeded_file_from_s3(url_to_remove)
                else:
                    val = form.data[keys[i]]
                    val.filename = get_unique_filename(val.filename)
                    optional_upload = upload_file_to_s3(val)
                    if "url" in optional_upload:
                        new_image = BusImage(business_id = id, url = optional_upload["url"])
                        db.session.add(new_image)

        db.session.commit()
        return {
            **bus.to_dict(),
            "images": [image.to_dict() for image in bus.images]
            # review/reply/owner info already in the store and will be preserved
        }, 201

    return {"error": form.errors}, 400


#CREATE A REVIEW
@bus_routes.route("/<int:id>/reviews", methods = ["POST"])
def create_review(id):
    """
    This route created a review for the specified business and upon success returns
    a review dictionary with extra images and reviewer keys.
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    bus = Business.query.get(id)
    if not bus:
        return {"error": "Business does not exist"}, 404

    form = ReviewForm()
    if "csrf_token" in request.cookies:
        form["csrf_token"].data = request.cookies["csrf_token"]
    else:
        return {"error": "Missing csrf_token"}, 403

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
    """
    This route deletes the specified optional business image and removes it from AWS.
    Returns a dictionary with a message key indicating success.
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    image = BusImage.query.get(id)
    if not image:
        return {"error": "Image not found"}, 404

    if current_user.id != image.business.owner_id:
        return {"error": "not authorized"}, 403

    remove_if_not_seeded_file_from_s3(image.url)

    db.session.delete(image)
    db.session.commit()

    return {"message": "Successfully deleted the business image"}

#GET ALL FAVORITE BUSINESSES BY CURRENT USER
@bus_routes.route("/current/favorites")
def get_all_fav_businesses_by_current_user():
    """
    This route returns an array of dictionaries of all the businesses
    favorited by the current user.
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    all_bus = [favorite.business for favorite in current_user.favorites]

    lst = []
    for bus in all_bus:
        images = [image.to_dict() for image in bus.images]
        average = [review.rating for review in bus.reviews]
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
        })
    return lst, 200

#CREATE A FAVORITE
@bus_routes.route("/<int:id>/favorites", methods = ["POST"])
def create_favorite(id):
    """
    This route creates a favorite between the logged in and the specified business.  Returns a favorite
    dictionary upon success.
    """
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



#from sqlalchemy.orm import joinedload, relationship

#all bus eager
@bus_routes.route("/eager")
def get_all_businesses_eager():
    businesses = Business.query.options(
                                joinedload(Business.owner),
                                joinedload(Business.images),
                                joinedload(Business.reviews).options(
                                joinedload(Review.replies)
                            )).all()

    lst = []
    for bus in businesses:
        images = [image.to_dict() for image in bus.images]
        ratings = [review.rating for review in bus.reviews]
        numReviews = len(ratings)
        average = sum(ratings)/len(ratings) if ratings else None
        lst.append({
            **bus.to_dict(),
            "owner": bus.owner.to_dict(),
            "average": average,
            "numReviews": numReviews,
            "images": images
        })
    return lst

#single business eager
@bus_routes.route("/<int:id>/eager")
def get_business_by_id_eager(id):

    bus = Business.query.filter(Business.id == id).options(
                                    joinedload(Business.owner),
                                    joinedload(Business.images),
                                    joinedload(Business.reviews).options(
                                    joinedload(Review.replies),
                                    joinedload(Review.reviewer)
                                )).first()

    if not bus:
        return {"error": "Business not found"}, 404

    reviews = [{
                    **review.to_dict(),
                    "reviewer": review.reviewer.to_dict(),
                    "replies": [reply.to_dict() for reply in review.replies]
                }
                    for review in bus.reviews ]

    ratings = [ review["rating"] for review in reviews ]
    average = sum(ratings)/len(ratings) if ratings else None
    return {
        **bus.to_dict(),
        "owner": bus.owner.to_dict(),
        "images": [image.to_dict() for image in bus.images],
        "reviews": reviews,
        "numReviews": len(reviews),
        "average": average
    }
