from pydantic import BaseModel, EmailStr  # BaseModel for models, EmailStr for email validation
from typing import List  # For list-based models
from typing import Optional


# USER REGISTER
class User(BaseModel):
    name: str
    email: EmailStr
    password: str

# USER LOGIN
class Login(BaseModel):
    email: EmailStr
    password: str

# post POSTS 
class Post(BaseModel):
    title: str
    content: str
    author_id: str
    tags: list[str] = []

# post COMMENTS
class Comment(BaseModel):
    post_id: str
    user_id: str
    content: str

# LIKES 
class LikeRequest(BaseModel):
    post_id: str  # Post being liked
    user_id: str  # User liking the post

# DISLIKES 
class DislikeRequest(BaseModel):
    post_id: str  # Post being liked
    user_id: str  # User liking the post

class Contact_Message(BaseModel):
    name: str
    email: EmailStr
    message: str
    # user_id: Optional[str] = None



class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str