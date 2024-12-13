from fastapi import APIRouter, HTTPException  # APIRouter for creating routes, HTTPException for error handling
from fastapi.encoders import jsonable_encoder  # To convert MongoDB objects into JSON-friendly format
from app.database import comments_collection, likes_collection, dislikes_collection, posts_collection  # Relevant collections
from bson import ObjectId  # To work with MongoDB's ObjectId
from datetime import datetime, timezone  # For timestamping
from app.pages.utils import convert_objectid
from app.models import Comment, LikeRequest, DislikeRequest
from datetime import datetime, timezone

reactions_router = APIRouter()

# POST COMMENT
@reactions_router.post("/posts/{post_id}/comments/")
async def add_comment(post_id: str, comment: Comment):
    try:
        # Convert the post_id to ObjectId
        post_object_id = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post_id format")

    # Check if the post exists in the database
    if not await posts_collection.find_one({"_id": post_object_id}):
        raise HTTPException(status_code=404, detail="Post not found")

    # Prepare comment data
    comment_data = comment.dict()
    comment_data["post_id"] = post_object_id  # Convert post_id in the comment to ObjectId
    comment_data["created_at"] = datetime.now(timezone.utc)  # Add the timestamp

    # Insert the comment into the database
    await comments_collection.insert_one(comment_data)

    return {"message": "Comment added successfully!"}


# get COMMENTS
@reactions_router.get("/posts/{post_id}/comments/")
async def get_comments(post_id: str):
    try:
        # Convert the post_id to ObjectId
        post_object_id = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post_id format")
    
    # Fetch the comments associated with the post_id
    comments = await comments_collection.find({"post_id": post_object_id}).to_list(100)

    # Count the total number of comments
    comment_count = await comments_collection.count_documents({"post_id": post_object_id})

    # Convert ObjectId to string for each comment before returning
    comments = convert_objectid(comments)

    return {
        "post_id": post_id,
        "comments": comments,
        "comment_count": comment_count
    }



# LIKES 
# post LIKES
@reactions_router.post("/posts/{post_id}/like/")
async def like_post(post_id: str, like_request: LikeRequest):
    try:
        # Convert post_id to ObjectId
        post_object_id = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post_id format")

    # Extract user_id from the request body
    user_id = like_request.user_id

    # Check if the like already exists
    existing_like = await likes_collection.find_one({"post_id": post_object_id, "user_id": user_id})
    if existing_like:
        raise HTTPException(status_code=400, detail="You have already liked this post")

    # Insert the like into the database
    like_data = {"post_id": post_object_id, "user_id": user_id, "created_at": datetime.now(timezone.utc)}
    await likes_collection.insert_one(like_data)

    return {"message": "Post liked successfully!"}


# GET LIKES
@reactions_router.get("/posts/{post_id}/likes/")
async def get_likes(post_id: str):
    try:
        # Convert post_id to ObjectId
        post_object_id = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post_id format")

    # Count likes for the post
    like_count = await likes_collection.count_documents({"post_id": post_object_id})

    return {"post_id": post_id, "likes": like_count}



# DISLIKES 
# post DISLIKES
@reactions_router.post("/posts/{post_id}/dislike/")
async def dislike_post(post_id: str, dislike_request: DislikeRequest):
    try:
        post_object_id = ObjectId(post_id)  # Convert post_id to ObjectId
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post_id format")

    user_id = dislike_request.user_id
    existing_dislike = await dislikes_collection.find_one({"post_id": post_object_id, "user_id": user_id})
    if existing_dislike:
        raise HTTPException(status_code=400, detail="You have already disliked this post")

    dislike_data = {"post_id": post_object_id, "user_id": user_id, "created_at": datetime.now(timezone.utc)}
    await dislikes_collection.insert_one(dislike_data)
    return {"message": "Post disliked successfully!"}


# get DISLIKES
@reactions_router.get("/posts/{post_id}/dislikes/")
async def get_dislikes(post_id: str):
    try:
        post_object_id = ObjectId(post_id)  # Convert post_id to ObjectId
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post_id format")

    dislike_count = await dislikes_collection.count_documents({"post_id": post_object_id})
    return {"post_id": post_id, "dislikes": dislike_count}
