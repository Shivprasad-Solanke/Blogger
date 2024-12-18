from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.database import users_collection
from app.models import User
from app.models import UserCreate, UserLogin
from bson import ObjectId

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

auth_router = APIRouter()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=30)):
    """
    Create a JWT access token with the provided data and expiration.
    """
    to_encode = data.copy()
    to_encode.update({"exp": datetime.utcnow() + expires_delta})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@auth_router.post("/signup/")
async def signup(user: UserCreate):
    # Check if email already exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password
    hashed_password = hash_password(user.password)

    # Create user document
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
    }

    # Insert into the database
    result = await users_collection.insert_one(new_user)

    return {"message": "User registered successfully", "id": str(result.inserted_id)}

@auth_router.post("/login/")
async def login(user: UserLogin):
    # Find the user by email
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Include the user's _id in the token
    token_data = {
        "sub": db_user["email"],
        "id": str(db_user["_id"])  # Convert ObjectId to string
    }

    # Create JWT token
    token = create_access_token(token_data)
    return {"access_token": token, "token_type": "bearer"}
