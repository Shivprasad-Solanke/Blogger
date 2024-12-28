from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles  # For serving static files
from fastapi.templating import Jinja2Templates  # For template rendering
from app.routes import router  # Import router to include all modular routes
from app.database import posts_collection
from app.pages.utils import convert_objectid
from bson import ObjectId  # To work with MongoDB's ObjectId
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from fastapi.staticfiles import StaticFiles



app = FastAPI()

# Initialize templates
templates = Jinja2Templates(directory="templates")

# Register all routes
app.include_router(router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5501"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

app.mount("/static", StaticFiles(directory="static"), name="static")