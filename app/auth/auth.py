from fastapi import APIRouter, HTTPException
from app.database import users_collection
from app.models import User, Login

auth_router = APIRouter()

# REGISTER
@auth_router.post("/register/")
async def register_user(user: User):
    # Check if the user already exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Insert new user
    await users_collection.insert_one(user.dict())
    return {"message": "User registered successfully!"}


# LOGIN
@auth_router.post("/login/")
async def login_user(login: Login):
    user = await users_collection.find_one({"email": login.email, "password": login.password})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user": {"name": user['name'], "email": user['email']}}