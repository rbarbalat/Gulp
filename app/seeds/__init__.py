from flask.cli import AppGroup
from .users import seed_users, undo_users
from .business import seed_businesses, undo_businesses
from .bus_images import seed_bus_images, undo_bus_images
from .reviews import seed_reviews, undo_reviews
from .rev_images import seed_rev_images, undo_rev_images
from .replies import seed_replies, undo_replies
from .favorites import seed_favorites, undo_favorites

from app.models.db import environment

seed_commands = AppGroup('seed')

@seed_commands.command('all')
def seed():
    if environment == 'production':
        undo_favorites()
        undo_replies()
        undo_rev_images()
        undo_reviews()
        undo_bus_images()
        undo_businesses()
        undo_users()

    users = seed_users()
    businesses = seed_businesses(users)
    seed_bus_images(businesses)
    reviews = seed_reviews(users, businesses)
    seed_rev_images(reviews)
    seed_replies(reviews)
    seed_favorites(users, businesses)

@seed_commands.command('undo')
def undo():
    undo_favorites()
    undo_replies()
    undo_rev_images()
    undo_reviews()
    undo_bus_images()
    undo_businesses()
    undo_users()
