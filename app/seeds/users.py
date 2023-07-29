from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from random import choice, sample
from datetime import datetime


# Adds a demo user, you can add other users here if you want
def seed_users():
    fake = Faker()

    demo = User(
        username='Demo', email='demo@aa.io', password='password',
        created_at = datetime(2022, 10, 1, 15)
    )
    marnie = User(
        username='Marnie', email='marnie@aa.io', password='password',
        created_at = datetime(2022, 10, 2, 15)
    )
    bobbie = User(
        username='Bobbie', email='bobbie@aa.io', password='password',
        created_at = datetime(2022, 10, 3, 15)
    )

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    # db.session.commit()

    lst = [demo, marnie, bobbie]
    num = 16

    names = []
    emails = []
    count = 0
    while count <= num:
        name = fake.name().split(" ")[0]
        email = f"{name}@aa.io"
        if name not in names:
            names.append(name)
            emails.append(email)
            count = count + 1

    for i in range(num):
        user = User(
            username = names[i],
            email = emails[i],
            password = "password",
            created_at = datetime(2022, 11, i + 1, 15)
        )
        db.session.add(user)
        lst.append(user)

    db.session.commit()
    print("seeded users")
    return lst


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
