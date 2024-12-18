from fastapi import APIRouter, HTTPException, Query, Path
from app.database import posts_collection, comments_collection, likes_collection, dislikes_collection, users_collection
from app.models import Post, Comment, LikeRequest, DislikeRequest
from bson import ObjectId
from app.pages.utils import convert_objectid
from fastapi.responses import FileResponse
import os
from fastapi.responses import HTMLResponse
from fastapi import Request, APIRouter
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timezone
from bson.objectid import ObjectId
from fastapi.security import OAuth2PasswordBearer





posts_router = APIRouter()

# # Helper function to get post details with likes, dislikes, and comments
# async def get_posts_details(filter_query=None):
#     if filter_query:
#         posts = await posts_collection.find(filter_query).to_list(length=10)
#     else:
#         posts = await posts_collection.find().to_list(length=10)

#     posts = convert_objectid(posts)
#     post_details_list = []

#     for post in posts:
#         author = await users_collection.find_one({"_id": ObjectId(post["author_id"])})
#         if not author:
#             raise HTTPException(status_code=404, detail=f"Author with id {post['author_id']} not found")

#         likes_count = await likes_collection.count_documents({"post_id": ObjectId(post["_id"])})
#         dislikes_count = await dislikes_collection.count_documents({"post_id": ObjectId(post["_id"])})
#         comments_count = await comments_collection.count_documents({"post_id": ObjectId(post["_id"])})
#         comments = await comments_collection.find({"post_id": ObjectId(post["_id"])}).to_list(length=10)
#         comments = convert_objectid(comments)

#         post_details = {
#             "title": post["title"],
#             "content_snippet": post["content"][:150],  # First 150 characters of content
#             "author_name": author["name"],
#             "created_at": post["created_at"],
#             "likes_count": likes_count,
#             "dislikes_count": dislikes_count,
#             "comments_count": comments_count,
#             "comments": comments
#         }

#         post_details_list.append(post_details)

#     return post_details_list

# Helper function to get post details with likes, dislikes, and comments
async def get_posts_details(filter_query=None):
    if filter_query:
        posts = await posts_collection.find(filter_query).to_list(length=10)
    else:
        posts = await posts_collection.find().to_list(length=10)

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
    




# # write post
# import jwt
# from fastapi import HTTPException, Depends, APIRouter
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from pydantic import BaseModel
# from datetime import datetime, timezone
# from pymongo import MongoClient

# # Security dependency from auth.py
# security = HTTPBearer()

# # Secret key for JWT decoding (use your own secret)
# SECRET_KEY = "your_secret_key_here"

# # MongoDB connection (assuming you have a collection for posts)
# client = MongoClient('mongodb://localhost:27017')
# db = client['blog_db']
# posts_collection = db['posts']

# # Post model
# class Post(BaseModel):
#     title: str
#     content: str
#     tags: list[str] = []

# # Router for blog posts
# posts_router = APIRouter()

# # Decode JWT to extract author ID
# def decode_jwt(token: str):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
#         return payload
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(status_code=401, detail="Token expired")
#     except jwt.InvalidTokenError:
#         raise HTTPException(status_code=401, detail="Invalid token")

# # Create a blog post route
# @posts_router.post("/write/", status_code=201)
# async def create_post(post: Post, credentials: HTTPAuthorizationCredentials = Depends(security)):
#     # Extract token and decode it
#     token = credentials.credentials
#     decoded_token = decode_jwt(token)
#     author_id = decoded_token.get("id")  # Ensure 'id' exists in JWT payload

#     if not author_id:
#         raise HTTPException(status_code=401, detail="Invalid author ID in token")

#     # Prepare post data for MongoDB
#     post_data = post.dict()
#     post_data["author_id"] = author_id
#     post_data["created_at"] = datetime.now(timezone.utc)

#     # Insert post into MongoDB
#     result = posts_collection.insert_one(post_data)

#     # Return the response with post details
#     return {"message": "Post created successfully!", "post_id": str(result.inserted_id)}
