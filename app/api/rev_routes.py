from flask import Blueprint, jsonify, request
from flask_login import current_user
from app.api.aws import get_unique_filename, upload_file_to_s3, remove_file_from_s3
from app.models import db, Review, RevImage, Reply
from app.forms.review_form import ReviewForm
from app.forms.reply_form import ReplyForm

from datetime import datetime

rev_routes = Blueprint("reviews", __name__)

#GET ALL REVIEWS BY CURRENT USER
@rev_routes.route("/current")
def get_all_reviews_by_current_user():
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    reviews = current_user.user_reviews
    numReviews = len(reviews)
    return [{
                **review.to_dict(),
                "business": review.business.to_dict(),
                "images": [ image.to_dict() for image in review.images ],
                "reviewer": { **current_user.to_dict(), "numReviews": numReviews }
            }
                for review in reviews]

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

    # remove any existing rev images from aws
    errors = []
    urls = [image.url for image in review.images]
    # len 32 comes from get_unique_file_name, don't want to delete the seed images which are also on aws
    for url in urls:
        if len(url.split("/")[3].split(".")[0]) == 32:
            aws = remove_file_from_s3(url)
            if isinstance(aws, dict):
                errors.append(aws["errors"])

    db.session.delete(review)
    db.session.commit()
    return {"message": "Successfully deleted the review"}

#Edit Review by Id
@rev_routes.route("/<int:id>", methods = ["PUT"])
def edit_review_by_id(id):
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
        return {"error": "Missing csrf_token"}, 404
        # check this error code

    if form.validate_on_submit():

        existing_images = review.images
        keys = ["first", "second", "third"]
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
                        new_image = RevImage(review_id = id, url = optional_upload["url"])
                        # existing_images.append(new_image)
                        db.session.add(new_image)
                        # db.session.commit()

        review.rating = form.data["rating"]
        review.review = form.data["review"]
        review.updated_at = datetime.now()
        db.session.commit()

        return {
            **review.to_dict(),
            "images": [image.to_dict() for image in review.images]
        }, 201

    return {"error": form.errors}, 400



#GET review by id
@rev_routes.route("/<int:id>")
def get_review_by_id(id):
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    review = Review.query.get(id)
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

#DELETE Review Image by Id
@rev_routes.route("/images/<int:id>", methods = ["DELETE"])
def delete_review_image_by_id(id):
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    image = RevImage.query.get(id)
    if not image:
        return {"error": "Image not found"}, 404

    if current_user.id != image.review.reviewer_id:
        return {"error": "not authorized"}, 403

    url = image.url
    errors = []
    # len 32 means it was made with get_unique_filename and user submitted (not seeded)
    if len(url.split("/")[3].split(".")[0]) == 32:
        aws = remove_file_from_s3(url)
        if isinstance(aws, dict):
            errors.append(aws["errors"])
            # print errors

    db.session.delete(image)
    db.session.commit()
    return {"message": "Successfully deleted the review image"}

#CREATE A REPLY
@rev_routes.route("/<int:id>/replies", methods = ["POST"])
def create_reply(id):
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    review = Review.query.get(id)
    if not review:
        return {"error": "Review does not exist"}, 404

    if current_user.id != review.business.owner_id:
        return {"error": "not authorized"}, 403

    form = ReplyForm()
    #form["csrf_token"].data = request.cookies.get("csrf_token")
    if "csrf_token" in request.cookies:
        form["csrf_token"].data = request.cookies["csrf_token"]
    else:
        return {"error": "Missing csrf_token"}, 404
        # check this error code

    if form.validate_on_submit():
        reply = Reply()

        reply.review_id = id
        reply.reply = form.data["reply"]
        reply.created_at = datetime.now()

        db.session.add(reply)
        db.session.commit()

        return reply.to_dict()

    return {"error": form.errors}, 400
