from fastapi import APIRouter, HTTPException  # APIRouter for creating routes, HTTPException for error handling
from fastapi.encoders import jsonable_encoder  # To convert MongoDB objects into JSON-friendly format
from app.database import comments_collection, likes_collection, dislikes_collection, posts_collection, users_collection  # Relevant collections
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









from bson import ObjectId

@reactions_router.post("/comments")
async def write_comment(comment_request: Comment):
    """
    Endpoint to allow a user to comment on a specific post.

    Args:
        comment_request (CommentRequest): The request body containing post_id, user_id, and content.

    Returns:
        dict: A success message with the created comment details.
    """
    # Destructure the request body
    post_id = comment_request.post_id
    user_id = comment_request.user_id
    content = comment_request.content.strip()

    if not content:
        raise HTTPException(status_code=400, detail="Comment content cannot be empty.")
    
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid post ID.")
    
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID.")

    # Fetch user details from users_collection
    try:
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        
        user_name = user.get("name", "Anonymous")  # Default to "Anonymous" if name is not found
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user details: {str(e)}")

    # Create the comment document
    comment = {
        "post_id": ObjectId(post_id),
        "user_id": ObjectId(user_id),
        "user_name": user_name,
        "content": content,
        "created_at": datetime.now(timezone.utc),
    }

    # Insert into comments_collection
    try:
        result = await comments_collection.insert_one(comment)
        if result.inserted_id:
            # Convert ObjectId fields to strings before returning the response
            comment["_id"] = str(result.inserted_id)
            comment["post_id"] = str(comment["post_id"])
            comment["user_id"] = str(comment["user_id"])
            return {
                "message": "Comment added successfully.",
                "comment": comment,
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to add the comment.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    

@reactions_router.post("/like")
async def like_post(like_request: LikeRequest):
    post_id = like_request.post_id
    user_id = like_request.user_id

    # Convert post_id to ObjectId
    try:
        post_id = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post_id format.")

    # Check if the user has already liked the post
    existing_like = await likes_collection.find_one({"post_id": post_id, "user_id": user_id})
    if existing_like:
        raise HTTPException(status_code=400, detail="Already liked.")

    # Check if the user has already disliked the post
    existing_dislike = await dislikes_collection.find_one({"post_id": post_id, "user_id": user_id})
    if existing_dislike:
        raise HTTPException(status_code=400, detail="Cannot like and dislike at the same time.")

    # Add the like
    like_data = {
        "post_id": post_id,
        "user_id": user_id,
        "timestamp": datetime.now(timezone.utc)
    }
    result = await likes_collection.insert_one(like_data)

    return {"message": "Post liked successfully.", "like_id": str(result.inserted_id)}


# dislike post
@reactions_router.post("/dislike")
async def dislike_post(dislike_request: DislikeRequest):
    post_id = dislike_request.post_id
    user_id = dislike_request.user_id

    # Convert post_id to ObjectId
    try:
        post_id = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post_id format.")

    # Check if the user has already disliked the post
    existing_dislike = await dislikes_collection.find_one({"post_id": post_id, "user_id": user_id})
    if existing_dislike:
        raise HTTPException(status_code=400, detail="Already disliked.")

    # Check if the user has already liked the post
    existing_like = await likes_collection.find_one({"post_id": post_id, "user_id": user_id})
    if existing_like:
        raise HTTPException(status_code=400, detail="Cannot dislike and like at the same time.")

    # Add the dislike
    dislike_data = {
        "post_id": post_id,
        "user_id": user_id,
        "timestamp": datetime.now(timezone.utc)
    }
    result = await dislikes_collection.insert_one(dislike_data)

    return {"message": "Post disliked successfully.", "dislike_id": str(result.inserted_id)}


# remove like
@reactions_router.delete("/like")
async def remove_like(like_request: LikeRequest):
    post_id = like_request.post_id
    user_id = like_request.user_id

    # Convert post_id to ObjectId
    try:
        post_id = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post_id format.")

    result = await likes_collection.delete_one({"post_id": post_id, "user_id": user_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Like not found.")

    return {"message": "Like removed successfully."}

# remove dislike
@reactions_router.delete("/dislike")
async def remove_dislike(dislike_request: DislikeRequest):
    post_id = dislike_request.post_id
    user_id = dislike_request.user_id

    # Convert post_id to ObjectId
    try:
        post_id = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post_id format.")

    result = await dislikes_collection.delete_one({"post_id": post_id, "user_id": user_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Dislike not found.")

    return {"message": "Dislike removed successfully."}
















@reactions_router.get("/posts/{post_id}/reactions")
async def get_reactions(post_id: str, user_id: str):
    try:
        post_id = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post_id format.")

    has_liked = await likes_collection.find_one({"post_id": post_id, "user_id": user_id}) is not None
    has_disliked = await dislikes_collection.find_one({"post_id": post_id, "user_id": user_id}) is not None

    return {"hasLiked": has_liked, "hasDisliked": has_disliked}
