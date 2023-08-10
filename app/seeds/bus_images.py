from app.models import db, Business, BusImage, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
fake = Faker()
from random import choice, sample, randint

def seed_bus_images(businesses):
    urls_0 = [
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/earl_opt_1.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/earl_opt_2.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/earl_opt_3.jpeg"
    ]
    urls_1 = [
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/gundis_opt_1.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/gundis_opt_2.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/gundis_opt_3.jpeg"
    ]
    urls_2 = [
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/mastros_opt_1.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/mastros_opt_2.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/mastros_opt_3.jpeg"
    ]
    urls_3 = [
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sappori_opt_1.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sappori_opt_2.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sappori_opt_3.jpeg"
    ]
    urls_4 = [
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sunda_opt_1.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sunda_opt_2.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sunda_opt_3.jpeg"
    ]
    urls_5 = [
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/frontera_opt_1.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/frontera_opt_2.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/frontera_opt_3.jpeg"
    ]
    urls = [urls_0, urls_1, urls_2, urls_3, urls_4, urls_5]

    for i in range(6):
        for j in range(3):
            bus_image = BusImage(business = businesses[i], url = urls[i][j])
            db.session.add(bus_image)

    db.session.commit()
    # print("seeded business images")


def undo_bus_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.bus_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM bus_images"))

    db.session.commit()
