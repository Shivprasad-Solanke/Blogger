from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles  # For serving static files
from fastapi.templating import Jinja2Templates  # For template rendering
from app.routes import router  # Import router to include all modular routes
from app.database import posts_collection
from app.pages.utils import convert_objectid
from bson import ObjectId  # To work with MongoDB's ObjectId


app = FastAPI()

# Initialize templates
templates = Jinja2Templates(directory="templates")

# Register all routes
app.include_router(router)