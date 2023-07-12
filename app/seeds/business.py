from app.models import db, User, Business, BusImage, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
fake = Faker()
from random import choice, sample, randint

def seed_businesses(users):
    lst = []
    for i in range(10):
        bus = Business(
            owner = choice(users),
            name = fake.text(max_nb_chars=randint(4, 12)),
            description = fake.text(max_nb_chars=randint(150, 300)),
            prev_url = fake.url(),
            address = fake.address(),
            city = fake.city(),
            state = fake.state()
        )
        db.session.add(bus)
        lst.append(bus)

    db.session.commit()
    return lst


def undo_businesses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.businesses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM businesses"))

    db.session.commit()
