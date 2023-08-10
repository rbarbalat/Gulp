from flask import Blueprint, request
from flask_login import current_user
from app.models import db, Reply
from app.forms.reply_form import ReplyForm

from datetime import datetime

reply_routes = Blueprint("replies", __name__)

#EDIT A REPLY
@reply_routes.route("/<int:id>", methods = ["PUT"])
def edit_reply_by_id(id):
    """
    This route edits the specified reply and on success returns a reply dictionary.
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    reply = Reply.query.get(id)
    if not reply:
        return {"error": "Reply does not exist"}, 404

    if current_user.id != reply.review.business.owner_id:
        return {"error": "not authorized"}, 403

    form = ReplyForm()
    if "csrf_token" in request.cookies:
        form["csrf_token"].data = request.cookies["csrf_token"]
    else:
        return {"error": "Missing csrf_token"}, 403

    if form.validate_on_submit():
        reply.reply = form.data["reply"]
        reply.updated_at = datetime.now()

        db.session.commit()
        return reply.to_dict()

    return {"error": form.errors}, 400

#DELETE Reply by Id
@reply_routes.route("/<int:id>", methods = ["DELETE"])
def delete_reply_by_id(id):
    """
    This route deletes the specified reply and on success returns a dictionary with a message key.
    """
    if not current_user.is_authenticated:
        return {"error": "not authenticated"}, 401

    reply = Reply.query.get(id)
    if not reply:
        return {"error": "Reply not found"}, 404

    if current_user.id != reply.review.business.owner_id:
        return {"error": "Not authorized"}

    db.session.delete(reply)
    db.session.commit()
    return {"message": "Successfully deleted the reply"}
