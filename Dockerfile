# Base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy application files
COPY app/ /app/
COPY config/nginx.conf /etc/nginx/nginx.conf

# Install dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Install Nginx
RUN apt update && apt install -y nginx && apt clean

# Expose port 80
EXPOSE 80

# Start FastAPI (Uvicorn) and Nginx
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port 8000 & nginx -g 'daemon off;'"]
