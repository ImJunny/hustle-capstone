# Use a Python slim base image
FROM python:3.10-slim

# Set the working directory
WORKDIR /server/ai

# Install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Download required NLTK datasets
RUN python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('punkt_tab')"

# Copy the application code
COPY . .

# Expose application port
EXPOSE 8000

# Run the FastAPI app with uvicorn
CMD ["sh", "-c", "uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000}"]