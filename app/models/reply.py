from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Reply(db.Model):
    __tablename__ = "replies"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    reply = db.Column(db.String(2000), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime)

    review_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('reviews.id')), nullable=False)
    review = db.relationship("Review", back_populates="replies")

    def to_dict(self):
        return {
            "id": self.id,
            "reply": self.reply,
            "review_id": self.review_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
