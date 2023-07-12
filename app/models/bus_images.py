from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class BusImage(db.Model):
    __tablename__ = "bus_images"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    updated_at = db.Column(db.DateTime)

    business_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('businesses.id')), nullable=False)

    business = db.relationship("Business", back_populates="images")

    def to_dict(self):
        return {
            "id": self.id,
            "url": self.url,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
