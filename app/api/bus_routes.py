from flask import Blueprint, jsonify, request
from flask_login import current_user
# from app.api.aws import get_unique_filename, upload_file_to_s3, remove_file_from_s3
from app.models import db, User,  Business, Review, BusImage, RevImage

bus_routes = Blueprint("businesses", __name__)

#GET ALL BUSINESSES
@bus_routes.route("/")
def get_all_teams_current_user():
    """
    This route returns an array of business dictionairies for all business in the db
    """
    all_bus = Business.query.all()
    if not all_bus:
        return []

    lst = []
    for bus in all_bus:
        # if needed
        # images = [image.to_dict() for image in bus.images]
        # reviews = [review.to_dict() for review in bus.bus_reviews]
        average = [review.rating for review in bus.bus_reviews]
        average = sum(average)/len(average)
        lst.append({
            **bus.to_dict(),
            "owner": bus.owner.to_dict(),
            "average": average
            # "images": images,
            # "reviews": reviews
        })
    return lst

#GET Business by Id
@bus_routes.route("/<int:id>")
def get_business_by_id(id):

    """
    Returns a dictionary of a business specified by id with extra image and reviews keys
    which are arrays of review and image dictionaries
    """

    bus = Business.query.get(id)
    if not bus:
        return {}

    images = [image.to_dict() for image in bus.images]
    reviews = [review.to_dict() for review in bus.bus_reviews]

    average = [review["rating"] for review in reviews ]
    average = sum(average)/len(average)

    return {
        **bus.to_dict(),
        "reviews": reviews,
        "images": images,
        "numReviews": len(reviews),
        "average": average
    }

#GET ALL BUSINESSES BY CURRENT USER
@bus_routes.route("/current")
def get_all_teams():
    """
    This route returns an array of dictionaries of all the businesses
    owned by the current user
    """
    if not current_user.is_authenticated:
        return {"error": "not authorized"}, 403

    all_bus = current_user.businesses
    if not all_bus:
        return []

    lst = []
    for bus in all_bus:
        # if needed
        # images = [image.to_dict() for image in bus.images]
        # reviews = [review.to_dict() for review in bus.bus_reviews]
        average = [review.rating for review in bus.bus_reviews]
        average = sum(average)/len(average)
        lst.append({
            **bus.to_dict(),
            "owner": bus.owner.to_dict(),
            "average": average
            # "images": images,
            # "reviews": reviews
        })
    return lst
