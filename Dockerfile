# Step 1: Use a base Python image
FROM python:3.10-slim

# Step 2: Set working directory in the container
WORKDIR .
#Install dependencies, including nginx
RUN apt-get update && apt-get install -y nginx && apt-get clean

# Step 3: Copy application files into the container
COPY . /app/
COPY config/nginx.conf /etc/nginx/nginx.conf

# Step 4: Copy the requirements.txt file from the root directory
COPY requirements.txt /app/requirements.txt

# Step 5: Install Python dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Step 6: Expose ports
# Port 80 for Nginx and FastAPI
EXPOSE 80

# Step 7: Start Uvicorn (FastAPI) and Nginx together
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port 8000 & nginx -g 'daemon off;'"]
