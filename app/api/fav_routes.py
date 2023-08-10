from flask import Blueprint
from flask_login import current_user
from app.models import db, Favorite

fav_routes = Blueprint("favorites", __name__)

#DELETE favorite by Id
@fav_routes.route("/<int:id>", methods = ["DELETE"])
def delete_fav_by_id(id):
    """
    This route deletes a favorite and on success returns a dictionary with a message key.
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    fav = Favorite.query.get(id)
    if not fav:
        return {"error": "Favorite not found"}, 404

    if current_user.id != fav.user_id:
        return {"error": "Not authorized"}, 403

    db.session.delete(fav)
    db.session.commit()
    return {"message": "Successfully deleted the favorite"}
