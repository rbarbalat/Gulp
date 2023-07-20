from app.models import db, User, Business, BusImage, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
fake = Faker()
from random import choice, sample, randint

def seed_businesses(users):
    urls = [
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/earl.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/brueggers.png",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/mastros.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/mesa.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/sunda_1.jpeg",
        "https://bucket-rb22.s3.us-east-2.amazonaws.com/frontera_2.jpeg"
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
        "Mastro's Steakhouse",
        "Mesa grill",
        "Sunda",
        "Frontera"
    ]
    descriptions = [0, 1, 2, 3, 4, 5]
    descriptions[0] = "Some 250 years after the invention of the sandwich, Earl of Sandwich® restaurants have embraced the idea and crafted it into a made-to-order, freshly baked sandwich like no other. Our menu pays tribute to the art of the sandwich. From our signature namesakes like The Original 1762® and The Full Montagu, to our fresh salads, we believe in using the highest quality ingredients in everything we serve. We believe that sandwiches are more than a convenience food; they should be carefully crafted and thoroughly enjoyed."
    descriptions[1] = "Now in our 35th year, Bruegger’s Bagels operates nearly 260 bakeries nationwide. Our menu has grown to include sandwiches for breakfast and lunch, garden-fresh salads, hearty soups, desserts and custom-roasted coffee — but the essence of Bruegger’s hasn’t changed. We’re still committed to serving genuine, New York-style bagels and real, made-in-Vermont cream cheese. Because that’s not just what we do; it’s where we come from."
    descriptions[2] = 'Consistently hailed by diners and critics alike as "masterful" (Los Angeles Daily News), "high end" ( Los Angeles Times), one of the "top 10 steakhouse in the U.S." (Gayot) and "the preferred steakhouse of celebs and locals" (944), Mastro`s Restaurants, LLC is a collection of sophisticated, classic steakhouses and sumptuous fish houses.'
    descriptions[3] = "The combination of Mesa Grill's magnificent decor, the exciting vibe of the casino atmosphere and Bobby Flay's stunning range of textures, flavors and colors incorporated into his menu continue to electrify diners year after year."
    descriptions[4] = "At Sunda, we pride ourselves on taking classic, culturally-important dishes from all over Southeast Asia and modernizing each one by upgrading ingredients, cooking techniques and presentation to create a tasting experience that is completely new while still retaining the deep-rooted spirit of the original."
    descriptions[5] = "It was 1987. Rick Bayless and his wife, Deann Groen Bayless, had just returned from an extended stay in Mexico, where they had been researching their first book. They wanted a restaurant that tasted and felt like their travels. So they hung colorful Mexican folk art on the walls, turned up the Mariachi music and packed the menu with the foods that reminded them of their travels:  tangy tomatillos, rich black beans, fiery chiles. And that’s how it’s been ever since. Not that we haven’t changed. We change all the time, adding new authentic flavors to our menus, developing new relationships with the Midwestern farmers who provide us with everything from summer squash to maple syrup to goat. But at the end of the day, no matter how inventive our techniques or local our ingredients, our food still transports you to the same place: the colorful, vibrant kitchens of Mexico."
    lst = []
    for i in range(6):
        bus = Business(
            owner = choice(users),
            name = names[i],
            description = descriptions[i],
            prev_url = urls[i],
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
