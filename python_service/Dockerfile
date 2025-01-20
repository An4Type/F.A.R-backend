# Use Python image
FROM python:3.9

# Set working directory
WORKDIR /usr/src/app

# Copy requirements and install
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source
COPY . .

# Expose port
EXPOSE 5000

# Start Flask server
CMD ["python", "server.py"]
