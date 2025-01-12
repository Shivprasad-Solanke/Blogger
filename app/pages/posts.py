from fastapi import APIRouter, HTTPException, Query, Path, Depends, Header , Body
from app.database import posts_collection, comments_collection, likes_collection, dislikes_collection, users_collection
from app.models import Post, Comment, LikeRequest, DislikeRequest , UpdatePostModel
from bson import ObjectId
from app.pages.utils import convert_objectid
from fastapi.responses import FileResponse
import os
from fastapi.responses import HTMLResponse
from fastapi import Request, APIRouter
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timezone
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.models import User
from fastapi import Request, APIRouter
from fastapi.responses import JSONResponse
from typing import List, Optional
from pydantic import BaseModel


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
posts_router = APIRouter()


# Helper function to get post details with likes, dislikes, and comments
async def get_posts_details(filter_query=None):
    if filter_query:
        posts = await posts_collection.find(filter_query).to_list(length=10)
    else:
        posts = await posts_collection.find().to_list(length=100)

    posts = convert_objectid(posts)  # Ensure all ObjectId fields are converted
    post_details_list = []

    for post in posts:
        author = await users_collection.find_one({"_id": ObjectId(post["author_id"])})
        if not author:
            raise HTTPException(status_code=404, detail=f"Author with id {post['author_id']} not found")

        likes_count = await likes_collection.count_documents({"post_id": ObjectId(post["_id"])})
        dislikes_count = await dislikes_collection.count_documents({"post_id": ObjectId(post["_id"])})
        comments_count = await comments_collection.count_documents({"post_id": ObjectId(post["_id"])})
        comments = await comments_collection.find({"post_id": ObjectId(post["_id"])}).to_list(length=10)
        comments = convert_objectid(comments)

        # Add the _id field as a string
        post_details = {
            "_id": str(post["_id"]),  # Convert ObjectId to string
            "title": post["title"],
            "content_snippet": post["content"][:150],  # First 150 characters of content
            "author_name": author["name"],
            "created_at": post["created_at"],
            "likes_count": likes_count,
            "dislikes_count": dislikes_count,
            "comments_count": comments_count,
            "comments": comments
        }

        post_details_list.append(post_details)

    return post_details_list

@posts_router.get("/posts")
async def get_posts(
    user_id: str = None,
    query: str = Query(None, description="Search term for titles or tags")
):
    filter_query = {}

    if user_id and query:
        filter_query = {
            "$and": [
                {"author_id": user_id},
                {
                    "$or": [
                        {"title": {"$regex": query, "$options": "i"}},  # Case-insensitive search in title
                        {"tags": {"$regex": query, "$options": "i"}}   # Case-insensitive search in tags
                    ]
                }
            ]
        }
    elif user_id:
        filter_query["author_id"] = user_id
    elif query:
        filter_query = {
            "$or": [
                {"title": {"$regex": query, "$options": "i"}},  # Case-insensitive search in title
                {"tags": {"$regex": query, "$options": "i"}}   # Case-insensitive search in tags
            ]
        }

    # Get the posts details based on the filter query
    posts_details = await get_posts_details(filter_query if filter_query else None)
    return {"posts": posts_details}


@posts_router.get("/posts/{post_id}")
async def get_post(post_id: str = Path(..., description="The ID of the post to retrieve")):
    try:
        post = await posts_collection.find_one({"_id": ObjectId(post_id)})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        author = await users_collection.find_one({"_id": ObjectId(post["author_id"])})

        if not author:
            raise HTTPException(status_code=404, detail="Author not found")

        likes_count = await likes_collection.count_documents({"post_id": ObjectId(post["_id"])})
        dislikes_count = await dislikes_collection.count_documents({"post_id": ObjectId(post["_id"])})
        comments_count = await comments_collection.count_documents({"post_id": ObjectId(post["_id"])})
        comments = await comments_collection.find({"post_id": ObjectId(post["_id"])}).to_list(length=10)
        comments = convert_objectid(comments)

        post_details = {
            "_id": str(post["_id"]),
            "title": post["title"],
            "content": post["content"],  # Full content
            "author_name": author["name"],
            "created_at": post["created_at"],
            "likes_count": likes_count,
            "dislikes_count": dislikes_count,
            "comments_count": comments_count,
            "comments": comments,
        }

        return {"post": post_details}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



  

# Route to create a new post
@posts_router.post("/write")
async def create_post(post: Post):
    
    # Prepare the post data
    post_data = post.dict()
    post_data["created_at"] = datetime.now(timezone.utc)

    # Insert the post into the database
    await posts_collection.insert_one(post_data)

    return {"message": "Post created successfully!"}


@posts_router.delete("/posts/{post_id}")
async def delete(post_id: str = Path(..., description="The ID of the post to delete")):
    try:
        # Convert post_id to ObjectId
        post_object_id = ObjectId(post_id)

        # Check if the post exists
        post = await posts_collection.find_one({"_id": post_object_id})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        # Delete the post
        result = await posts_collection.delete_one({"_id": post_object_id})

        # Check if a post was actually deleted
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Post not found")
        
                # Delete associated comments
        comments_result = await comments_collection.delete_many({"post_id": post_object_id})

        # Delete associated likes and dislikes
        likes_result = await likes_collection.delete_many({"post_id": post_object_id})
        dislikes_result = await dislikes_collection.delete_many({"post_id": post_object_id})

        return {
            "message": "Post deleted successfully!",
            "deleted_comments_count": comments_result.deleted_count,
            "deleted_likes_count": likes_result.deleted_count,
            "deleted_dislikes_count": dislikes_result.deleted_count,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



class BlogUpdate(BaseModel):
    title: str
    content: str
    tags: list[str] = []

@posts_router.get("/posts/{post_id}", response_model=Post)
async def get_post(post_id: str):
    try:
        # Convert post_id to ObjectId for MongoDB
        post_object_id = ObjectId(post_id)

        # Fetch post from the database
        post = await posts_collection.find_one({"_id": post_object_id})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        # Convert MongoDB ObjectId to string for serialization
        post["_id"] = str(post["_id"])

        return post
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@posts_router.put("/posts/{post_id}")
async def update_post(post_id: str, update_data: BlogUpdate):
    try:
        # Convert post_id to ObjectId for MongoDB
        post_object_id = ObjectId(post_id)

        # Check if the post exists
        existing_post = await posts_collection.find_one({"_id": post_object_id})
        if not existing_post:
            raise HTTPException(status_code=404, detail="Post not found")

        # Prepare update document
        update_doc = {
            "$set": {
                "title": update_data.title,
                "content": update_data.content,
                "tags": update_data.tags  # This ensures the tags are updated correctly
            }
        }

        # Update the post in the database
        result = await posts_collection.update_one({"_id": post_object_id}, update_doc)

        # Check if the post was updated
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Post update failed")

        return {"message": "Post updated successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))