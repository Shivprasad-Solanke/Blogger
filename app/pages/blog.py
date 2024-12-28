from fastapi import APIRouter, HTTPException
from app.database import posts_collection  # MongoDB collection import
from bson import ObjectId  # For handling ObjectId
from app.pages.utils import convert_objectid  # Utility to convert ObjectId to string
from app.models import Post
from datetime import datetime, timezone

blog_router = APIRouter()

# POST route for creating a new post
@blog_router.post("/write")
async def create_post(post: Post):
    # Add a timestamp to the post data
    post_data = post.dict()
    post_data["created_at"] = datetime.now(timezone.utc)

    # Insert the post into the database
    await posts_collection.insert_one(post_data)

    return {"message": "Post created successfully!"}

# GET route for fetching all posts
@blog_router.get("/posts/")
async def get_all_posts():
    posts = await posts_collection.find().to_list(100)
    posts = convert_objectid(posts)  # Ensure ObjectId is converted to string
    return {"posts": posts}

# GET route for fetching a single post by ID
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

# DELETE route for deleting a post
@blog_router.delete("/post/{post_id}/")
async def delete_post(post_id: str):
    # Convert the post_id to ObjectId
    try:
        post_object_id = ObjectId(post_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid post_id format")

    # Delete the post from the collection
    result = await posts_collection.delete_one({"_id": post_object_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")

    return {"message": "Post deleted successfully"}
