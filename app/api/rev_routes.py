from flask import Blueprint, jsonify, request
from flask_login import current_user
# from app.api.aws import get_unique_filename, upload_file_to_s3, remove_file_from_s3
from app.models import db, User, Business, Review, BusImage, RevImage
from app.forms.review_form import ReviewForm

rev_routes = Blueprint("reviews", __name__)

#GET ALL REVIEWS BY CURRENT USER
@rev_routes.route("/current")
def get_all_reviews_by_current_user():
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    reviews = [{
                **review.to_dict(),
                "business": review.business.to_dict(),
                "reviewer": review.reviewer.to_dict(),
                "images": [ image.to_dict() for image in review.images ]
                }
               for review in current_user.user_reviews]
    return reviews

#DELETE Review by Id
@rev_routes.route("/<int:id>", methods = ["DELETE"])
def delete_review_by_id(id):
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    review = Review.query.get(id)
    if not review:
        return {"error": "Review not found"}, 404

    if current_user.id != review.reviewer_id:
        return {"error": "Not authorized"}

    db.session.delete(review)
    db.session.commit()

    return {"message": "Successfully Deleted"}
