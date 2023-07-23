from app.models import db, User, Business, Review, RevImage, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
fake = Faker()
from random import choice, sample, randint
from datetime import datetime

def seed_reviews(users, businesses):

    lst = []
    #businesses[i] is owned by user[i]
    #for now 6 businesses, so users[6:] is a list of non-owner users
    for i in range(len(businesses)):
        for j in range(3):
            review = Review(
                reviewer = users[6:][j + 2*i],
                business = businesses[i],
                rating = randint(1, 5),
                review = fake.text(max_nb_chars=randint(100, 950)),
                created_at = datetime(2023, randint(1,6), randint(1,25), 15)
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
