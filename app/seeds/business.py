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
    addresses = [
        "5000 Forbes ave",
        "3000 Shady Ave",
        "800 Clark St",
        "1000 Monroe Ave",
        "500 Washington Ave",
        "2000 Division St",
        "300 Wells St",
        "1500 Madison Ave",
        "200 Fifth Ave",
        "900 Deming St"
    ]
    cities = [
        "Boston",
        "New York City",
        "Philadelphia",
        "Baltimore",
        "Pittsburgh",
        "Atlanta",
        "Chicago",
        "Denver",
        "Seattle",
        "San Francisco"
    ]
    states = [
        "Massachusetts",
        "New York",
        "Pennsylvania",
        "Maryland",
        "Pennsylvania",
        "Georgia",
        "Illinois",
        "Colorado",
        "Washington",
        "California"
    ]
    names = [
        "The Earl of Sandwich",
        "Bruegger's Bagels",
        "Sichuan House",
        "The Capital Grille",
        "Mastro's Steakhouse",
        "Aiello's",
        "Mineo's",
        "Mesa Grill",
        "Joe's Barbecue",
        "Sunda"
    ]
    lst = []
    for i in range(10):
        bus = Business(
            owner = choice(users),
            name = names[i],
            description = fake.text(max_nb_chars=randint(50, 150)),
            prev_url = choice(urls),
            address = addresses[i],
            city = cities[i],
            state = states[i]
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
