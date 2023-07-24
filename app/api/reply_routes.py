from flask import Blueprint, jsonify, request
from flask_login import current_user
from app.models import db, Reply, Business, Review

reply_routes = Blueprint("replies", __name__)

@reply_routes.route("/")
def get_all_replies():
    pass
