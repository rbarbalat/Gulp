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
    # for i in range(len(reviews)):
    #     if i not in [2, 5, 8, 11, 14, 17]:
    #         reply = Reply(
    #             review = reviews[i],
    #             reply = fake.text(max_nb_chars=randint(200, 500)),
    #             created_at = reviews[i].created_at
    #         )
    #         db.session.add(reply)

    replies = [
        "Thank you for your wonderful review.  I'm so happy that you enjoyed all your meals at the Earl of Sandwich.  Its customers like you that make this job worth doing!",
        "The lamb shank is my favorite item on the menu as well!  Thank you for dining at The Gundis!",
        "No better combo than steak & seafood.  Give the King Crab legs a try next time.  Thanks for your nice review!",
        "I'm sorry your meal was only average.  We strive to make exceptional dishes and we hope that you give us another shot!",
        "Sorry to hear that your order was messed up.  Happy to hear that you enjoyed the food.  I will send you a message about a free meal as compensation.",
        "We definitely strive for both taste and authenticity.  Thanks for the five star review!"
    ]
    selected_reviews = [
        reviews[0],
        reviews[3],
        reviews[8],
        reviews[11],
        reviews[14],
        reviews[17]
    ]
    for i in range(len(replies)):
        reply = Reply(
            review = selected_reviews[i],
            reply = replies[i],
            created_at = selected_reviews[i].created_at
        )
        db.session.add(reply)

    db.session.commit()
    # print("seeded replies")


def undo_replies():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.replies RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM replies"))

    db.session.commit()
