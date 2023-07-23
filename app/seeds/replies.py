from app.models import db, Reply, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from random import choice, sample, randint
from datetime import datetime

fake = Faker()

def seed_replies(reviews):
    pass

def undo_replies():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.replies RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM replies"))

    db.session.commit()
