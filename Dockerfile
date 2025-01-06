# Step 1: Use a base Python image
FROM python:3.10-slim

# Step 2: Set working directory in the container
WORKDIR /app

# Step 3: Install dependencies, including nginx
RUN apt-get update && apt-get install -y nginx && apt-get clean

# Step 4: Copy application files into the container
COPY app /app/app
COPY config/nginx.conf /etc/nginx/nginx.conf

# Step 5: Copy the requirements.txt file
COPY requirements.txt /app/requirements.txt

# Step 6: Install Python dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Step 7: Expose ports
EXPOSE 80 8000

# Step 8: Start Uvicorn (FastAPI) and Nginx together
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port 8000 & nginx -g 'daemon off;'"]
