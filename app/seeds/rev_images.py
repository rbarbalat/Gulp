from app.models import db, RevImage, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
fake = Faker()
from random import choice, sample, randint

def seed_rev_images(reviews):
    urls = []
    bus_urls = [
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/earl_rev_1.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/earl_rev_2.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/earl_rev_3.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/earl_rev_4.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/earl_rev_5.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/earl_rev_6.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/earl_rev_7.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/earl_rev_8.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/earl_rev_9.jpeg"
    ]
    urls.extend(bus_urls)

    bus_urls = [
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/gundis_rev_1.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/gundis_rev_2.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/gundis_rev_3.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/gundis_rev_4.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/gundis_rev_5.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/gundis_rev_6.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/gundis_rev_7.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/gundis_rev_8.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/gundis_rev_9.jpeg"
    ]
    urls.extend(bus_urls)

    bus_urls = [
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/mastros_rev_1.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/mastros_rev_2.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/mastros_rev_3.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/mastros_rev_4.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/mastros_rev_5.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/mastros_rev_6.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/mastros_rev_7.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/mastros_rev_8.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/mastros_rev_9.jpeg"
    ]
    urls.extend(bus_urls)

    # 1 p i sapori here, had 2ps in the bus images and mandatory preview image
    bus_urls = [
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sapori_rev_1.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sapori_rev_2.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sapori_rev_3.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sapori_rev_4.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sapori_rev_5.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sapori_rev_6.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sapori_rev_7.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sapori_rev_8.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sapori_rev_9.jpeg"
    ]
    urls.extend(bus_urls)

    bus_urls = [
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sunda_rev_1.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sunda_rev_2.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sunda_rev_3.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sunda_rev_4.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sunda_rev_5.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sunda_rev_6.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sunda_rev_7.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sunda_rev_8.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sunda_rev_9.jpeg"
    ]
    urls.extend(bus_urls)

    bus_urls = [
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/frontera_rev_1.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/frontera_rev_2.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/frontera_rev_3.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/frontera_rev_4.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/frontera_rev_5.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/frontera_rev_6.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/frontera_rev_7.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/frontera_rev_8.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/frontera_rev_9.jpeg"
    ]
    urls.extend(bus_urls)

    #6 businesses and 3 reviews per business
    for i in range(len(reviews)):
        for j in range(3):
            rev_image = RevImage(
                review=reviews[i],
                url = urls[3*i + j]
            )
            db.session.add(rev_image)

    db.session.commit()
    print("seeded review images")

    # urls = [
    #     "https://upload.wikimedia.org/wikipedia/commons/2/2b/Beef_fillet_steak_with_mushrooms.jpg",
    #     "https://upload.wikimedia.org/wikipedia/commons/a/ad/Oberhafenkantine_%28Hamburger_Rundst%C3%BCck%29.jpg",
    #     "https://upload.wikimedia.org/wikipedia/commons/f/f6/Eataly_Las_Vegas_-_Feb_2019_-_Sarah_Stierch_12.jpg",
    #     "https://upload.wikimedia.org/wikipedia/commons/b/b0/NewYorkSlices.jpg",
    #     "https://upload.wikimedia.org/wikipedia/commons/5/5d/2014_smoked_salmon_and_egg_salad_toasted_baguette.JPG",
    # ]
    # # urls = ["https://bucket-rb22.s3.us-east-2.amazonaws.com/sunda_1.jpeg"]
    # for i in range(len(reviews)):
    #     for j in range(3):
    #         rev_image = RevImage(
    #             review = reviews[i],
    #             # url = fake.url()
    #             url = choice(urls)
    #         )
    #         db.session.add(rev_image)
    # db.session.commit()
    # print("seeded review images")


def undo_rev_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.rev_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM rev_images"))

    db.session.commit()
