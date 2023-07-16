from app.models import db, Business, BusImage, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
fake = Faker()
from random import choice, sample, randint

def seed_bus_images(businesses):
    urls = [
        "https://upload.wikimedia.org/wikipedia/commons/6/62/Barbieri_-_ViaSophia25668.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/3/3a/Chef%27s_table_at_Marcus.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/c/cd/Desire_Oyster_Bar_interior.jpg"
    ]
    for i in range(len(businesses)):
        for j in range(3):
            bus_image = BusImage(
                business = businesses[i],
                # url = fake.url()
                url = urls[j]
            )
            db.session.add(bus_image)
    db.session.commit()
    print("seeded business images")


def undo_bus_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.bus_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM bus_images"))

    db.session.commit()
