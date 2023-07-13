from flask import Blueprint, jsonify, request
from flask_login import current_user
# from app.api.aws import get_unique_filename, upload_file_to_s3, remove_file_from_s3
from app.models import db, User, Business, Review, BusImage, RevImage
from app.forms.bus_form import BusForm
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
        if len(average) == 0:
            average = None
        else:
            average = sum(average)/len(average)
        lst.append({
            **bus.to_dict(),
            "owner": bus.owner.to_dict(),
            "average": average,
            "numReviews": len(bus.bus_reviews)
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

    all_bus = current_user.businesses
    if not all_bus:
        return [], 404

    lst = []
    for bus in all_bus:
        # images = [image.to_dict() for image in bus.images]
        # reviews = [review.to_dict() for review in bus.bus_reviews]
        average = [review.rating for review in bus.bus_reviews]
        if len(average) == 0:
            average = None
        else:
            average = sum(average)/len(average)
        lst.append({
            **bus.to_dict(),
            "owner": bus.owner.to_dict(),
            "average": average,
            "numReviews": len(bus.bus_reviews)
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

    db.session.delete(bus)
    db.session.commit()
    return {"message": "Successfully Deleted"}

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

        bus = Business()
        # can't use form.populate_obj(bus) b/c have to populate multiple objects

        bus.owner_id = current_user.id
        bus.name = form.data["name"]
        bus.description = form.data["description"]
        bus.prev_url = form.data["prev_url"]
        bus.address = form.data["address"]
        bus.city = form.data["city"]
        bus.state = form.data["state"]

        db.session.add(bus)
        db.session.commit()

        # form.data[key] always exists but can be (None or empty?)
        keys = ["first", "second", "third"]
        images = [ BusImage(business = bus, url = form.data[key])
            for key in keys if form.data[key] ]

        _ = [db.session.add(image) for image in images]
        db.session.commit()
        images = [image.to_dict() for image in images]

        return {
            **bus.to_dict(),
            "images": images,
            "owner": current_user.to_dict()
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

    form = BusForm()
    #form["csrf_token"].data = request.cookies.get("csrf_token")
    if "csrf_token" in request.cookies:
        form["csrf_token"].data = request.cookies["csrf_token"]
    else:
        return {"error": "Missing csrf_token"}, 404
        # check this error code

    if form.validate_on_submit():

        bus.name = form.data["name"]
        bus.description = form.data["description"]
        bus.address = form.data["address"]
        bus.city = form.data["city"]
        bus.state = form.data["state"]

        # this field is required so there is something there
        bus.prev_url = form.data["prev_url"]

        db.session.commit()

        #don't allow deletions of images in the update form
        #separate delete button
        existing_images = bus.images
        keys = ["first", "second", "third"]
        for i in range(3):
            # works if you force an order of first, second, third on the front end
            # keys[i] in form.data True for all i in range(3) but its value might be None
            if form.data[keys[i]]:
                if len(existing_images) >= i + 1:
                    existing_images[i].url = form.data[keys[i]]
                else:
                    new_image = BusImage(business_id = id, url = form.data[keys[i]])
                    db.session.add(new_image)
                    existing_images.append(new_image)

        #handle updating images here, have to query for each bus_image
        #might need to create new busImages, or delete existing ones, or update the url

        db.session.commit()
        images = [image.to_dict() for image in images]

    return {"error": form.errors}, 400


#CREATE A REVIEW
@bus_routes.route("/<int:id>/review", methods = ["POST"])
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
