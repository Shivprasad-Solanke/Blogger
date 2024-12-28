from fastapi import APIRouter, HTTPException, Query, Path, Depends, Header
from app.database import users_collection, posts_collection
from app.models import Post, User
from bson import ObjectId
from app.pages.utils import convert_objectid
from fastapi.responses import FileResponse
import os
from fastapi.responses import HTMLResponse
from fastapi import Request, APIRouter
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timezone
from jose import jwt, JWTError
from pydantic import BaseModel

profile_router = APIRouter()

# Model for updating the user's name
class UpdateUserName(BaseModel):
    user_id: str
    name: str


# Route to get user profile
@profile_router.get("/profile")
async def get_user_profile(user_id: str):
    try:
        # Fetch user from the database
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Count the number of posts written by the user
        post_count = await posts_collection.count_documents({"author_id": user_id})

        # Prepare response
        user_profile = {
            "name": user["name"],
            "email": user["email"],
            "post_count": post_count,
        }
        return {"profile": user_profile}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Route to update the user's name
@profile_router.put("/profile")
async def update_user_name(user_data: UpdateUserName):
    try:
        # Update the user's name in the database
        result = await users_collection.update_one(
            {"_id": ObjectId(user_data.user_id)}, {"$set": {"name": user_data.name}}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")

        return {"message": "User name updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))