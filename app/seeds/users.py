from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from random import choice, sample


# Adds a demo user, you can add other users here if you want
def seed_users():
    fake = Faker()

    demo = User(
        username='Demo', email='demo@aa.io', password='password')
    marnie = User(
        username='marnie', email='marnie@aa.io', password='password')
    bobbie = User(
        username='bobbie', email='bobbie@aa.io', password='password')

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    # db.session.commit()

    lst = [demo, marnie, bobbie]
    num = 22

    names = []
    count = 0
    while count <= num:
        name = fake.name().split(" ")[0]
        if name not in names:
            names.append(name)
            count = count + 1

    emails = []
    count = 0
    while count <= num:
        email = fake.email()
        if email not in emails:
            emails.append(email)
            count = count + 1

    for i in range(num):
        user = User(
            username = names[i],
            email = emails[i],
            password = "password"
            )
        db.session.add(user)
        lst.append(user)

    db.session.commit()
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
