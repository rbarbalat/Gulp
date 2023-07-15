from app.models import db, User, Business, Review, RevImage, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
fake = Faker()
from random import choice, sample, randint

def seed_reviews(users, businesses):
    lst = []
    for i in range(60):
        review = Review(
            reviewer = choice(users),
            business = choice(businesses),
            rating = randint(1, 5),
            review = fake.text(max_nb_chars=randint(50, 150)),
        )
        db.session.add(review)
        lst.append(review)

    db.session.commit()
    print("seeded reviews")
    return lst


def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()
