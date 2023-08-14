from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Review(db.Model):
    __tablename__ = "reviews"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    review = db.Column(db.String(2000), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime)

    reviewer_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    business_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('businesses.id')), nullable=False)

    reviewer = db.relationship("User", back_populates="user_reviews")
    business = db.relationship("Business", back_populates="reviews")

    images = db.relationship("RevImage", back_populates="review", cascade="all, delete-orphan")

    replies = db.relationship("Reply", back_populates="review", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "rating": self.rating,
            "review": self.review,
            "reviewer_id": self.reviewer_id,
            "business_id": self.business_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
