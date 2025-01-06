# Step 1: Use an official Python image as the base image
FROM python:3.10-slim

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the FastAPI application code into the container
COPY . .

# Step 4: Install the required Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Step 5: Install Nginx and configure it
RUN apt update && apt install -y nginx && apt clean

# Copy your custom Nginx configuration file
COPY config/nginx.conf /etc/nginx/nginx.conf

# Step 6: Expose the port the app runs on
EXPOSE 80

# Step 7: Run both FastAPI and Nginx (via a script or directly)
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port 8000 & nginx -g 'daemon off;'"]