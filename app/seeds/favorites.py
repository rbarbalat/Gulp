from app.models import db, Favorite, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from random import choice, sample, randint
from datetime import datetime

fake = Faker()

def seed_favorites(users, businesses):
    pass

def undo_favorites():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.favorites RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM favorites"))

    db.session.commit()
