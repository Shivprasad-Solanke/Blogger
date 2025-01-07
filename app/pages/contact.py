from fastapi import  HTTPException
from database import contactmsg
from models import Contact_Message

from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone



# Contact Router
contact_router = APIRouter()


@contact_router.post("/api/contact")
async def send_contact_message(contact: Contact_Message):
    # Insert contact message into MongoDB collection
    contact_dict = contact.dict()
    try:
        result = await contactmsg.insert_one(contact_dict)
        return {"message": "Message sent successfully!", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving message: {e}")
