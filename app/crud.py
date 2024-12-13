from bson import ObjectId  # To handle MongoDB IDs
from app.database import (
    posts_collection,
    comments_collection,
    likes_collection,
    dislikes_collection,
)  # Import collections
from datetime import datetime, timezone  # For timestamp operations
from fastapi.encoders import jsonable_encoder  # To encode database data
