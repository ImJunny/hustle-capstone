# Use a Python base image
FROM python:3.10-slim

# Set the working directory
WORKDIR /

# Install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Download NLTK datasets
RUN python -m nltk.downloader punkt stopwords

# Copy the application code
COPY . .

# Expose the application port
EXPOSE 8000

# Run the FastAPI app with uvicorn
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]