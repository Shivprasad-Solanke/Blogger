from fastapi import APIRouter, Depends, Request
# from app.models import get_user_blogs
# from app.auth import get_current_user
# from fastapi.responses import HTMLResponse
# from fastapi.templating import Jinja2Templates

dashboard_router = APIRouter()
# templates = Jinja2Templates(directory="templates")

# @dashboard_router.get("/dashboard", response_class=HTMLResponse)
# async def dashboard(request: Request, user: dict = Depends(get_current_user)):
#     blogs = get_user_blogs(user_id=user['id'])
#     return templates.TemplateResponse("dashboard.html", {"request": request, "user": user, "blogs": blogs})

# @dashboard_router.post("/blogs/delete/{blog_id}")
# async def delete_blog(blog_id: int, user: dict = Depends(get_current_user)):
#     blog = get_blog_by_id(blog_id)
#     if blog and blog.user_id == user['id']:
#         delete_blog_from_db(blog_id)
#         return {"message": "Blog deleted successfully"}
#     return {"error": "Unauthorized or Blog not found"}