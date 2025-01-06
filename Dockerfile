# Step 1: Use a base Python image
FROM python:3.10-slim

# Step 2: Set working directory in the container
WORKDIR /app

# Step 3: Copy the entire project directory
# This ensures we maintain the correct directory structure
COPY . /app/

# Step 4: Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Step 5: Add the application root to Python path
ENV PYTHONPATH=/app

# Step 6: Expose port 80 for Nginx and FastAPI
EXPOSE 80

# Step 7: Start Uvicorn (FastAPI) and Nginx together
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port 8000 & nginx -g 'daemon off;'"]