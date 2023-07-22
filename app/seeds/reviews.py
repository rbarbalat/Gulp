from app.models import db, User, Business, Review, RevImage, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
fake = Faker()
from random import choice, sample, randint

def seed_reviews(users, businesses):

    lst = []
    #business[i] is owned by user[i]
    #for now 6 businesses, so users[6:] is a list of non-owner users
    for i in range(len(businesses)):
        for j in range(3):
            review = Review(
                reviewer = users[6:][j + 2*i],
                business = businesses[i],
                rating = randint(1, 5),
                review = fake.text(max_nb_chars=randint(100, 950)),
            )
            db.session.add(review)
            lst.append(review)

    # lst = []
    # for i in range(60):
    #     review = Review(
    #         reviewer = choice(users),
    #         business = choice(businesses),
    #         rating = randint(1, 5),
    #         review = fake.text(max_nb_chars=randint(50, 950)),
    #     )
    #     db.session.add(review)
    #     lst.append(review)

    db.session.commit()
    print("seeded reviews")
    return lst


def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()
