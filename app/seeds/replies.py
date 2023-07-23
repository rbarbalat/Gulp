from app.models import db, Reply, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from random import choice, sample, randint
from datetime import datetime

fake = Faker()

def seed_replies(reviews):
    # 18 reviews = 6 businesses * reviews per business to start
    # seed replies for 2/3 of reviews of each business
    # skip every third review, indexes, 2, 5, 8, 11, 14, 17
    for i in range(len(reviews)):
        if i not in [2, 5, 8, 11, 14, 17]:
            reply = Reply(
                review = reviews[i],
                review = fake.text(max_nb_chars=randint(200, 500)),
                created_at = reviews[i].created_at
            )
            db.session.add(reply)

    db.session.commit()


def undo_replies():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.replies RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM replies"))

    db.session.commit()
