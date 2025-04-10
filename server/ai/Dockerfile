# Use a Python slim base image
FROM python:3.10-slim

# Set the working directory
WORKDIR /server/ai

# Install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Download required NLTK datasets
RUN python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

# Copy the application code
COPY . .

# Expose application port
EXPOSE 8000

# Run the FastAPI app with uvicorn
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "${PORT:-8000}"]