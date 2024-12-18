# from fastapi import APIRouter, HTTPException, Path
# from app.database import posts_collection, comments_collection, likes_collection, dislikes_collection, users_collection
# from bson import ObjectId
# from app.pages.utils import convert_objectid
# from app.pages.search import get_filtered_posts_details

# dashboard_router = APIRouter()

# # Helper function to get details for posts by a specific user
# async def get_user_posts_details(user_id: str):
#     # Build a MongoDB filter query for posts authored by this user
#     filter_query = {"author_id": user_id}

#     # Fetch filtered posts based on the query using the existing helper function
#     return await get_filtered_posts_details(filter_query)

# # Route to fetch all posts by a specific user
# @dashboard_router.get("/users/{user_id}/posts")
# async def get_user_posts(user_id: str = Path(..., description="User ID to fetch authored posts")):
#     try:
#         # Validate the user_id and ensure the user exists
#         user = await users_collection.find_one({"_id": ObjectId(user_id)})
#         if not user:
#             raise HTTPException(status_code=404, detail="User nooo not found")

#         # Fetch posts authored by the user
#         user_posts = await get_user_posts_details(user_id)

#         return {"posts": user_posts}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
