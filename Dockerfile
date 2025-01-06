# Step 1: Use a base Python image
FROM python:3.10-slim

# Step 2: Set working directory in the container
WORKDIR /app

# Step 3: Copy application files into the container
COPY app/ /app/
COPY config/nginx.conf /etc/nginx/nginx.conf

# Step 4: Install Python dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Step 5: Install MongoDB
RUN apt-get update && apt-get install -y mongodb && apt-get clean

# Step 6: Create MongoDB data directory
RUN mkdir -p /data/db

# Step 7: Expose ports
# Port 27017 for MongoDB
# Port 80 for Nginx and FastAPI
EXPOSE 27017 80

# Step 8: Start MongoDB, Uvicorn (FastAPI), and Nginx together
CMD ["sh", "-c", "mongod --fork --logpath /var/log/mongodb.log --dbpath /data/db && uvicorn main:app --host 0.0.0.0 --port 8000 & nginx -g 'daemon off;'"]
