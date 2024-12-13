from fastapi import APIRouter
from app.auth.auth import auth_router
from app.pages.blog import blog_router
from app.pages.reactions import reactions_router


# Initialize the router instance
router = APIRouter()

# Include all route modules here
router.include_router(auth_router, prefix="", tags=["auth"])
router.include_router(blog_router, prefix="", tags=["blog"])
router.include_router(reactions_router, prefix="", tags=["reaction"])
