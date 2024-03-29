from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import User, db
from app.api.aws import get_unique_filename, upload_file_to_s3, remove_if_not_seeded_file_from_s3
from app.forms.user_image_form import UserImageForm

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}

@user_routes.route("/image", methods = ["DELETE"])
def delete_image():
    if not current_user.is_authenticated:
        return {"error": "Unauthorized"}, 403

    remove_if_not_seeded_file_from_s3(current_user.url)

    #restore the default profile pic
    current_user.url = "https://bucket-rb22.s3.us-east-2.amazonaws.com/stock_user.png"
    db.session.commit()
    return current_user.to_dict()

@user_routes.route("/image", methods = ["PATCH"])
def add_image():
    if not current_user.is_authenticated:
        return {"error": "Unauthorized"}, 403

    form = UserImageForm()
    if "csrf_token" in request.cookies:
        form["csrf_token"].data = request.cookies["csrf_token"]
    else:
        return {"error": "No csrf token "}, 400

    if form.validate_on_submit():
        image = form.data["image"]
        image.filename = get_unique_filename(image.filename)

        #upload has either a "url" key or an "errors" key
        upload = upload_file_to_s3(image)
        if "url" not in upload:
            return {"error": "failed b/c of problem with the image file"}, 400

        remove_if_not_seeded_file_from_s3(current_user.url)
        current_user.url = upload["url"]

        db.session.commit()
        return current_user.to_dict()

    return {"errors": form.errors}, 400


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()
