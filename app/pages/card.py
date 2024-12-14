from fastapi import APIRouter, HTTPException
from app.database import posts_collection, comments_collection, likes_collection, dislikes_collection, users_collection
from app.models import Post, Comment, LikeRequest, DislikeRequest
from bson import ObjectId
from app.pages.utils import convert_objectid

card_router = APIRouter()

# Helper function to get details for all posts
async def get_all_posts_details():
    # Fetch all posts from the posts collection
    posts = await posts_collection.find().to_list(length=10)  # You can adjust the length if needed

    # Convert ObjectId in posts collection to strings for consistency
    posts = convert_objectid(posts)

    post_details_list = []
    
    for post in posts:
        # Fetch the author details (name) from the users collection
        author = await users_collection.find_one({"_id": ObjectId(post["author_id"])})
        if not author:
            raise HTTPException(status_code=404, detail=f"Author with id {post['author_id']} not found")
        
        # Count the number of likes for the post
        likes_count = await likes_collection.count_documents({"post_id": ObjectId(post["_id"])})
        
        # Count the number of dislikes for the post
        dislikes_count = await dislikes_collection.count_documents({"post_id": ObjectId(post["_id"])})
        
        # Count the number of comments for the post
        comments_count = await comments_collection.count_documents({"post_id": ObjectId(post["_id"])})
        
        # Get the comments for the post (optional, you can include only a few if needed)
        comments = await comments_collection.find({"post_id": ObjectId(post["_id"])}).to_list(length=10)
        
        # Convert ObjectId in comments to string
        comments = convert_objectid(comments)
        
        # Prepare the post details
        post_details = {
            "title": post["title"],
            "content_snippet": post["content"][:150],  # Displaying the first 100 characters of content as a snippet
            "author_name": author["name"], 
            "created_at": post["created_at"],  # Assuming created_at is present in the post
            "likes_count": likes_count,
            "dislikes_count": dislikes_count,
            "comments_count": comments_count,
            "comments": comments  # This will include a list of comments
        }
        
        post_details_list.append(post_details)

    return post_details_list

# Route to fetch all posts details along with associated likes, dislikes, and comments
@card_router.get("/posts/details")
async def get_posts_with_details():
    all_posts_details = await get_all_posts_details()
    return {"posts": all_posts_details}
