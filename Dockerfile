# Step 1: Use a base Python image
FROM python:3.10-slim

# Step 2: Set working directory in the container
WORKDIR /app

# Step 3: Copy application files into the container
COPY . /app/

# Step 4: Copy Nginx configuration
COPY config/nginx.conf /etc/nginx/nginx.conf

# Step 5: Copy the requirements.txt file from the root directory
COPY requirements.txt /app/requirements.txt

# Step 6: Install Python dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Step 7: Add the application root to Python path
ENV PYTHONPATH=/app

# Step 8: Expose ports
# Port 80 for Nginx and FastAPI
EXPOSE 80

# Step 9: Start Uvicorn (FastAPI) and Nginx together
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port 8000 & nginx -g 'daemon off;'"]