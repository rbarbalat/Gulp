from flask import Blueprint, jsonify, request
from flask_login import current_user
from app.models import db, Favorite, Business, User

fav_routes = Blueprint("favorites", __name__)

@fav_routes.route("/")
def get_all_favorites():
    pass
