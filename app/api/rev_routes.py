from flask import Blueprint, request
from flask_login import current_user
from app.api.aws import get_unique_filename, upload_file_to_s3, remove_if_not_seeded_file_from_s3
from app.models import db, Review, RevImage, Reply
from app.forms.review_form import ReviewForm
from app.forms.reply_form import ReplyForm

from sqlalchemy.orm import joinedload

from datetime import datetime

rev_routes = Blueprint("reviews", __name__)


@rev_routes.route("/current")
def get_all_reviews_by_current_user():
    """
    This route returns a list of review dictionaries associated with the logged in user
    that have extra business, images and review keys.
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    reviews = Review.query.filter(
                Review.reviewer_id == current_user.id
            ).options(
                joinedload(Review.business),
                joinedload(Review.images)
            ).all()

    reviewer =  { **current_user.to_dict(), "numReviews": len(reviews) }

    return [{
                **review.to_dict(),
                "business": review.business.to_dict(),
                "images": [ image.to_dict() for image in review.images ],
                "reviewer": reviewer
            }
                for review in reviews]


@rev_routes.route("/<int:id>", methods = ["DELETE"])
def delete_review_by_id(id):
    """
    This route deletes the specified review and removes any associated review images from AWS and
    on success returns a dictionary with a message key indicating success.
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    review = Review.query.get(id)
    if not review:
        return {"error": "Review not found"}, 404

    if current_user.id != review.reviewer_id:
        return {"error": "Not authorized"}, 403

    # remove any existing rev images from aws
    urls = [image.url for image in review.images]
    for url in urls:
        remove_if_not_seeded_file_from_s3(url)

    db.session.delete(review)
    db.session.commit()
    return {"message": "Successfully deleted the review"}


@rev_routes.route("/<int:id>", methods = ["PUT"])
def edit_review_by_id(id):
    """
    This route edits the specified review and associated review images and on success
    returns a review dictionary with an extra images key.
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    review = Review.query.get(id)
    if not review:
        return {"error": "Review not found"}, 404

    if review.reviewer_id != current_user.id:
        return {"error": "Not Authorized"}, 403

    form = ReviewForm()
    if "csrf_token" in request.cookies:
        form["csrf_token"].data = request.cookies["csrf_token"]
    else:
        return {"error": "Missing csrf_token"}, 403

    if form.validate_on_submit():
        existing_images = review.images
        keys = ["first", "second", "third"]
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
                        new_image = RevImage(review_id = id, url = optional_upload["url"])
                        db.session.add(new_image)

        review.rating = form.data["rating"]
        review.review = form.data["review"]
        review.updated_at = datetime.now()
        db.session.commit()

        return {
            **review.to_dict(),
            "images": [image.to_dict() for image in review.images]
        }, 201

    return {"error": form.errors}, 400



@rev_routes.route("/<int:id>")
def get_review_by_id(id):
    """
    This route returns the specified review as a dictionary with extra business, images, and review keys.
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    review = Review.query.filter(Review.id == id).options(
        joinedload(Review.business),
        joinedload(Review.images)
    ).first()

    if not review:
        return {"error": "Review not found"}, 404

    if review.reviewer_id != current_user.id:
        return {"error": "Not Authorized"}, 403

    return {
        **review.to_dict(),
        "business": review.business.to_dict(),
        "images": [image.to_dict() for image in review.images],
        "reviewer": { **current_user.to_dict(), "numReviews": len(current_user.user_reviews) }
    }


@rev_routes.route("/images/<int:id>", methods = ["DELETE"])
def delete_review_image_by_id(id):
    """
    This route deletes the specified review image and removes it from AWS.  Upon success it returns a
    dictionary with a message key.
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    image = RevImage.query.get(id)
    if not image:
        return {"error": "Image not found"}, 404

    if current_user.id != image.review.reviewer_id:
        return {"error": "not authorized"}, 403

    remove_if_not_seeded_file_from_s3(image.url)

    db.session.delete(image)
    db.session.commit()
    return {"message": "Successfully deleted the review image"}


@rev_routes.route("/<int:id>/replies", methods = ["POST"])
def create_reply(id):
    """
    This route creates a reply for the specified review and upon success returns the reply as a dictionary.
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    review = Review.query.get(id)
    if not review:
        return {"error": "Review does not exist"}, 404

    if current_user.id != review.business.owner_id:
        return {"error": "not authorized"}, 403

    form = ReplyForm()

    if "csrf_token" in request.cookies:
        form["csrf_token"].data = request.cookies["csrf_token"]
    else:
        return {"error": "Missing csrf_token"}, 404

    if form.validate_on_submit():
        reply = Reply()

        reply.review_id = id
        reply.reply = form.data["reply"]
        reply.created_at = datetime.now()

        db.session.add(reply)
        db.session.commit()

        return reply.to_dict()

    return {"error": form.errors}, 400
