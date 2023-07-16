from app.models import db, User, Business, BusImage, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
fake = Faker()
from random import choice, sample, randint

def seed_businesses(users):
    urls = [
        "https://upload.wikimedia.org/wikipedia/commons/6/62/Barbieri_-_ViaSophia25668.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/3/3a/Chef%27s_table_at_Marcus.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/c/cd/Desire_Oyster_Bar_interior.jpg"
    ]
    lst = []
    for i in range(10):
        bus = Business(
            owner = choice(users),
            name = fake.text(max_nb_chars=randint(10, 20)),
            description = fake.text(max_nb_chars=randint(50, 150)),
            prev_url = choice(urls),
            address = fake.address(),
            city = fake.city(),
            state = fake.state()
        )
        db.session.add(bus)
        lst.append(bus)

    db.session.commit()
    print("seeded businesses")
    return lst


def undo_businesses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.businesses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM businesses"))

    db.session.commit()
