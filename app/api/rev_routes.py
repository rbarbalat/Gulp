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

    #have to remove any rev images from Amazon!!
    db.session.delete(review)
    db.session.commit()

    return {"message": "Successfully Deleted"}

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
        review.rating = form.data["rating"]
        review.review = form.data["review"]
        db.session.commit()

        existing_images = review.images
        keys = ["first", "second", "third"]
        for i in range(3):
            # works if you force an order of first, second, third on the front end
            # keys[i] in form.data True for all i in range(3) but its value might be None
            if form.data[keys[i]]:
                if len(existing_images) >= i + 1:
                    existing_images[i].url = form.data[keys[i]]
                else:
                    new_image = RevImage(review_id = id, url = form.data[keys[i]])
                    db.session.add(new_image)
                    existing_images.append(new_image)
            else:
                #if user sends back an empty string, that means delete (for now)
                if len(existing_images) >= i + 1:
                    existing_images[i].url = ""


        db.session.commit()
        del_images = []
        retain_images = []
        for image in existing_images:
            if image.url == "":
                del_images.append(image)
            else:
                retain_images.append(image)

        #these would have to be removed from Amazon as well
        _ = [db.session.delete(image) for image in del_images]
        db.session.commit()

        retain_images = [image.to_dict() for image in retain_images]
        # singleRev: {...state.singleRev, ...action.review}
        # should still have the other key/value pairs in the store
        return {
            **review.to_dict(),
            "images": retain_images
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
