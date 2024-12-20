from fastapi import APIRouter
from app.auth.auth import auth_router
from app.pages.reactions import reactions_router
from app.pages.posts import posts_router
from app.pages.profile import profile_router

# Initialize the router instance
router = APIRouter()

# Include all route modules here
router.include_router(auth_router, prefix="", tags=["auth"])
router.include_router(reactions_router, prefix="", tags=["reaction"])
router.include_router(posts_router, prefix="", tags=["user posts"])
router.include_router(profile_router, prefix="", tags=["user profile"])