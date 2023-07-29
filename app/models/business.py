from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Business(db.Model):
    __tablename__ = "businesses"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.String(2000), nullable=False)
    prev_url = db.Column(db.String(200), nullable=False)
    address = db.Column(db.String(100))
    city = db.Column(db.String(50))
    state = db.Column(db.String(50))
    tag_one = db.Column(db.String(20), nullable=False)
    tag_two = db.Column(db.String(20), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    updated_at = db.Column(db.DateTime)

    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)

    owner = db.relationship("User", back_populates="businesses")

    bus_reviews = db.relationship("Review", back_populates="business", cascade="all, delete-orphan")

    images = db.relationship("BusImage", back_populates="business", cascade="all, delete-orphan")

    fans = db.relationship("Favorite", back_populates="business", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "owner_id": self.owner_id,
            "description": self.description,
            "tag_one": self.tag_one,
            "tag_two": self.tag_two,
            "preview_image": self.prev_url,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
