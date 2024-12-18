from fastapi import APIRouter, HTTPException, Query, Path
from app.database import posts_collection, comments_collection, likes_collection, dislikes_collection, users_collection
from app.models import Post, Comment, LikeRequest, DislikeRequest
from bson import ObjectId
from app.pages.utils import convert_objectid

posts_router = APIRouter()

# Helper function to get post details with likes, dislikes, and comments
async def get_posts_details(filter_query=None):
    if filter_query:
        posts = await posts_collection.find(filter_query).to_list(length=10)
    else:
        posts = await posts_collection.find().to_list(length=10)

    posts = convert_objectid(posts)
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

        post_details = {
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