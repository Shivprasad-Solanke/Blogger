from fastapi import FastAPI
from app.pages.dashboard import dashboard_router

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}