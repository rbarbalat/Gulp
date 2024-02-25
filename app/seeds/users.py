from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_users():

    demo = User(
        username='Demo', email='demo@aa.io', password='password',
        url = "https://bucket-rb22.s3.us-east-2.amazonaws.com/demo.jpeg",
        created_at = datetime(2022, 10, 1, 15)
    )
    marnie = User(
        username='Marnie', email='marnie@aa.io', password='password',
        url = "https://bucket-rb22.s3.us-east-2.amazonaws.com/marnie.jpeg",
        created_at = datetime(2022, 10, 2, 15),
    )
    bobbie = User(
        username='Bobbie', email='bobbie@aa.io', password='password',
        url = "https://bucket-rb22.s3.us-east-2.amazonaws.com/bobbie.jpeg",
        created_at = datetime(2022, 10, 3, 15)
    )

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)

    lst = [demo, marnie, bobbie]

    names = [
        "Anna",
        "Arthur",
        "Brian",
        "Barbara",
        "Carl",
        "Clarissa",
        "Dennis",
        "Danielle",
        "Eric",
        "Erica",
        "Fred",
        "Faith",
        "Gary",
        "Gina",
        "Hector",
        "Heather"
    ]
    emails = [
        "anna@aa.io",
        "arthur@aa.io",
        "brian@aa.io",
        "barbara@aa.io",
        "carl@aa.io",
        "clarissa@aa.io",
        "dennis@aa.io",
        "danielle@aa.io",
        "eric@aa.io",
        "erica@aa.io",
        "fred@aa.io",
        "faith@aa.io",
        "gary@aa.io",
        "gina@aa.io",
        "hector@aa.io",
        "heather@aa.io"
    ]
    urls = [
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/anna.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/arthur.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/brian.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/barbara.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/carl.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/clarissa.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/dennis.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/danielle.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/eric.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/erica.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/fred.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/faith.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/gary.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/gina.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/hector.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/heather.jpeg",
    ]
    for i in range(len(names)):
        user = User(
            username = names[i],
            email = emails[i],
            password = "password",
            url = urls[i],
            created_at = datetime(2022, 11, i + 1, 15)
        )
        db.session.add(user)
        lst.append(user)

    db.session.commit()
    return lst

def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
