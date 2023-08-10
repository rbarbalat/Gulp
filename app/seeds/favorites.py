from app.models import db, Favorite, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from random import choice, sample, randint
from datetime import datetime

fake = Faker()
def seed_favorites(users, businesses):
    # 6 owners and 16 non-owner users in the seed data, (0,..,21)
    # for now the 6 owners (0,..,5) have no favorites
    # users (6,...12) have 1 favorite
    # users (13,...21) have 2 favorites
    for i in range(len(users)):
        if i in range(6, 13):
            favorite = Favorite(
                user = users[i],
                business = businesses[randint(0, len(businesses) - 1)]
            )
            db.session.add(favorite)
        if i in range(13, 22):
            indexes = sample(range(len(businesses)), 2)
            favorite = Favorite(
                user = users[i],
                business = businesses[indexes[0]]
            )
            db.session.add(favorite)
            favorite = Favorite(
                user = users[i],
                business = businesses[indexes[1]]
            )
            db.session.add(favorite)

    db.session.commit()
    # print("seeded favorites")

def undo_favorites():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.favorites RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM favorites"))

    db.session.commit()
