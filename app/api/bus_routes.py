from flask import Blueprint, jsonify, request
from flask_login import current_user
from app.api.aws import get_unique_filename, upload_file_to_s3, remove_file_from_s3
from app.models import db, User, Business, Review, BusImage, RevImage
from app.forms.bus_form import BusForm
from app.forms.edit_bus_form import EditBusForm
from app.forms.review_form import ReviewForm

bus_routes = Blueprint("businesses", __name__)

#GET ALL BUSINESSES
@bus_routes.route("/")
def get_all_businesses():
    """
    This route returns an array of business dictionairies for all business in the db
    """
    all_bus = Business.query.all()
    if not all_bus:
        return [], 404

    lst = []
    for bus in all_bus:
        # if needed
        # images = [image.to_dict() for image in bus.images]
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
            "numReviews": numReviews
            # "images": images,
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
    for review in bus.bus_reviews:
        rev_images = [image.to_dict() for image in review.images]
        reviews.append({
           **review.to_dict(),
           "images": rev_images,
           "reviewer": review.reviewer.to_dict()
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
        "average": average
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
        # images = [image.to_dict() for image in bus.images]
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
            "numReviews": numReviews
            # "images": images,
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
    errors = []
    optional_urls = [image.url for image in bus.images]
    urls = [bus.prev_url, *optional_urls]
    for url in urls:
        if url: #should always be true but just in case
            aws = remove_file_from_s3(url)
            if isinstance(aws, dict):
                errors.append(aws["errors"])

    db.session.delete(bus)
    db.session.commit()
    if not errors:
        return {"message": "Successfully deleted the business"}
    else:
        return {
            "message": "Successfully deleted but have AWS errors",
            "errors": errors
        }


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
        if "url" not in upload:
            return {"error": "failed b/c of problem with the preview image file"}, 400

        # these keys come from the field names in the form
        keys = ["first", "second", "third"]
        optional_uploads = []
        for key in keys:
            #key in form.data always True but form.data[key] can be None
            if form.data[key]:
                val = form.data[key]
                val.filename = get_unique_filename(val.filename)
                optional_upload = upload_file_to_s3(val)
                if "url" not in optional_upload:
                    return {"error": f"failed b/c of problem with optional image file {key}"}
                optional_uploads.append(optional_upload)

        bus = Business()
        bus.prev_url = upload["url"]

        bus.owner_id = current_user.id
        bus.name = form.data["name"]
        bus.description = form.data["description"]
        bus.address = form.data["address"]
        bus.city = form.data["city"]
        bus.state = form.data["state"]

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
        # if the user did not change the picture, the frontend sends back nothing
        if form.data["prev_url"]:
            prev_url = form.data["prev_url"]
            prev_url.filename = get_unique_filename(prev_url.filename)
            upload = upload_file_to_s3(prev_url)
            if "url" not in upload:
                return {"error": "There was a problem with your preview image"}, 400
            bus.prev_url = upload["url"]

        keys = ["first", "second", "third"]
        existing_images = bus.images
        new_urls = []
        for i in range(3):
            if form.data[keys[i]]:
                if len(existing_images) >= i + 1:
                    url_to_remove = existing_images[i].url
                    val = form.data[keys[i]]
                    val.filename = get_unique_filename(val.filename)
                    optional_upload = upload_file_to_s3(val)
                    if "url" in optional_upload:
                        existing_images[i].url = optional_upload["url"]
                        aws = remove_file_from_s3(url_to_remove)
                else:
                    val = form.data[keys[i]]
                    val.filename = get_unique_filename(val.filename)
                    optional_upload = upload_file_to_s3(val)
                    if "url" in optional_upload:
                        new_image = BusImage(business_id = id, url = optional_upload["url"])
                        existing_images.append(new_image)
                        db.session.add(new_image)
                        db.session.commit()

        bus.name = form.data["name"]
        bus.description = form.data["description"]
        bus.address = form.data["address"]
        bus.city = form.data["city"]
        bus.state = form.data["state"]


        db.session.commit()

        #don't allow deletions of images in the update form
        #separate delete button
        # existing_images = bus.images
        # keys = ["first", "second", "third"]
        # for i in range(3):
        #     # works if you force an order of first, second, third on the front end
        #     # keys[i] in form.data True for all i in range(3) but its value might be None
        #     if form.data[keys[i]]:
        #         if len(existing_images) >= i + 1:
        #             existing_images[i].url = form.data[keys[i]]
        #         else:
        #             new_image = BusImage(business_id = id, url = form.data[keys[i]])
        #             db.session.add(new_image)
        #             existing_images.append(new_image)
        #     else:
        #         #if user sends back an empty string, that means delete (for now)
        #         if len(existing_images) >= i + 1:
        #             existing_images[i].url = ""

        #commit the new images added in line 233
        # db.session.commit()
        # del_images = []
        # retain_images = []
        # for image in existing_images:
        #     if image.url == "":
        #         del_images.append(image)
        #     else:
        #         retain_images.append(image)

        #these would have to be removed from Amazon as well
        # _ = [db.session.delete(image) for image in del_images]
        # db.session.commit()

        # retain_images = [image.to_dict() for image in retain_images]

        #remove lines 236 to 254 EXCLUDING db.session.commit() on 252
        #this is the end for the original working edit route that doesn't allow for deletions
        # images = [image.to_dict() for image in existing_images]
        # singleBus: {...state.singleBus, ...action.business}
        # should still the reviews, numReviews, average keys in the store b/ they aren't being overwritten
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

        review = Review()
        # can't use form.populate_obj(bus) b/c have to populate multiple objects

        review.reviewer_id = current_user.id
        review.business_id = id
        review.review = form.data["review"]
        review.rating = form.data["rating"]

        db.session.add(review)
        db.session.commit()

        # https://www.google.com/
        keys = ["first", "second", "third"]
        images = [ RevImage(review = review, url = form.data[key])
            for key in keys if form.data[key] ]

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

    errors = []
    if image.url: #should always be true but just in case
        aws = remove_file_from_s3(image.url)
        if isinstance(aws, dict):
            errors.append(aws["errors"])

    db.session.delete(image)
    db.session.commit()

    if not errors:
        return {"message": "Successfully deleted the business image"}
    else:
        return {
            "message": f"Successfully deleted the image but have the following error {errors[0]}"
        }
