from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient  # For database connection


client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["blog_database"]

# Collections
users_collection = db.users
posts_collection = db.posts
comments_collection = db.comments
likes_collection = db.likes
dislikes_collection = db.dislikes