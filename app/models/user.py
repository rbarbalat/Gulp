from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    url = db.Column(db.String(200), default="https://bucket-rb22.s3.us-east-2.amazonaws.com/stock_user.png")
    created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)

    businesses = db.relationship("Business", back_populates="owner", cascade="all, delete-orphan")

    user_reviews = db.relationship("Review", back_populates="reviewer", cascade="all, delete-orphan")

    favorites = db.relationship("Favorite", back_populates= "user", cascade="all, delete-orphan")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            "url": self.url,
            "created_at": self.created_at
        }
