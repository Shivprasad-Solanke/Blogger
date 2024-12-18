from fastapi import APIRouter, HTTPException  # APIRouter for creating routes, HTTPException for error handling
from app.database import posts_collection  # Relevant collections
from bson import ObjectId  # To work with MongoDB's ObjectId
from app.pages.utils import convert_objectid
from app.models import Post
from datetime import datetime, timezone

blog_router = APIRouter()

@blog_router.post("/write")
async def create_post(post: Post):
    # Add a timestamp to the post data
    post_data = post.dict()
    post_data["created_at"] = datetime.now(timezone.utc)

    # Insert the post into the database
    await posts_collection.insert_one(post_data)

    return {"message": "Post created successfully!"}

# get POSTS
@blog_router.get("/posts/")
async def get_all_posts():
    posts = await posts_collection.find().to_list(100)
    posts = convert_objectid(posts)
    return {"posts": posts}

# get single POST
@blog_router.get("/post/{post_id}/")
async def get_post(post_id: str):
    # Convert the post_id to ObjectId
    try:
        post_object_id = ObjectId(post_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid post_id format")
    
    # Find the post by the ObjectId
    post = await posts_collection.find_one({"_id": post_object_id})
    
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Convert ObjectId to string before returning
    post = convert_objectid(post)
    
    return {"post": post}