from app.models import db, RevImage, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
fake = Faker()
from random import choice, sample, randint

def seed_rev_images(reviews):
    for i in range(len(reviews)):
        for j in range(3):
            rev_image = RevImage(
                review = reviews[i],
                url = fake.url()
            )
            db.session.add(rev_image)
    db.session.commit()
    print("seeded review images")


def undo_rev_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.rev_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM rev_images"))

    db.session.commit()
