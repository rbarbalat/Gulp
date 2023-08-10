from app.models import db, User, Business, Review, RevImage, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
fake = Faker()
from random import choice, sample, randint
from datetime import datetime

def seed_reviews(users, businesses):

    rev1 = [
        "I've tried all the sandwiches this place has to offer and they are all amazing.  This is the best sandwich place by a mile.  I'm sad they don't have any locations nearby.",
        "This place is decent but I am dissapointed becauses it didn't live up to the hype.  Don't get me wrong, I had a great sandwich just wasn't blown away",
        "Maybe it was just the location I went to but the sandwich I had was not good.  I would have been better off with a sub.  On the other hand all my friends enjoyed their meals."
    ]
    rat1 = [5, 2, 3]

    rev2 = [
        "The lamb shank with rosemary sauce and bulgur was the most delicious meal in my entire life!  I still haven't gotten over it.  I will be coming back again and again!",
        "This was my first time dining here and it was a great experience.  I was part of a big group that tried almost the entire dinner menu so I can vouch for the menu being good across the board, not just a few specials",
        "Everything was really good and my partner loved the vegetarian options especially the Zaza Pasta Tofu and the Red Lentil & Goat Cheese soup"
    ]
    rat2 = [5, 4, 4]

    rev3 = [
        "Mastro's is a pretty standard high-end steakhouse.  There is not a single thing I can complain about but I'm not giving it 5 stars because it doesn't stand out from the pack.",
        "I'm slightly unhappy with my experience here because they didn't prepare my steak exactly like I told them.  I wanted it between rare and medium rare but it wasn't cooked down the middle, it was closer to rare than medium rare and I noticed!",
        "I'm not big into steak but when its this good I can appreciate it.  The seafood didn't dissapoint either, especially the Chilean sea bass!"
    ]
    rat3 = [4, 3, 4]

    rev4 = [
        "Love the atmosphere, love the food, love the service.  Thanks for a perfect night!  Will recommend to all my friends!",
        "I love italian food and they have it all here!  Lasagna, Carbonara, Risotto... I'm actually tempted to take a star off for giving me to many amazing options.  It took a lot of mental strain to come to a decision but I guess that's why I have to keep coming back until I try the entire menu.",
        "This place is just average.  Food tasted good but I'm pretty sure with the same ingredients I can make the same dishes myself at home!"
    ]
    rat4 = [5, 5, 3]

    rev5 = [
        "This was my first time trying Southeast Asian food and it was so good.  Especially the lamb lollipops, black cod and pork belly.  Can't wait to come back!!!",
        "The food, the atmosphere and the service were all fantastic!  Highly recommended!",
        "It took them forever to take my order and they messed it up anyway.  I'll admit the food tasted great but the service definitely didn't match it."
    ]
    rat5 = [4, 4, 2]

    rev6 = [
        "The crispy duck carnitas were really great , everything else was so so and the beer was terrible",
        "I decided to try this place because I love Tortas Frontera.  It was worth trying but I'll definitely stick to Tortas Frontera going forward",
        "This was the tastiest mexican food I have ever had and I've had a lot.  I also couldn't believe how authentic it was.  FIVE STARS!!"
    ]
    rat6 = [3,3,5]

    reviews = [rev1, rev2, rev3, rev4, rev5, rev6]
    ratings = [rat1, rat2, rat3, rat4, rat5, rat6]
    lst = []
    #businesses[i] is owned by user[i]
    #for now 6 businesses, so users[6:] is a list of non-owner users
    for i in range(len(businesses)):
        for j in range(3):
            review = Review(
                reviewer = users[6:][j + 2*i],
                business = businesses[i],
                rating = ratings[i][j],
                review = reviews[i][j],
                created_at = datetime(2023, randint(1,6), randint(1,25), 15)
            )
            db.session.add(review)
            lst.append(review)

    db.session.commit()
    # print("seeded reviews")
    return lst


def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()
