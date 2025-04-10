import re
from nltk.corpus import stopwords # type: ignore
from nltk.tokenize import word_tokenize # type: ignore
from fastapi import FastAPI, Query # type: ignore
from groq import Groq # type: ignore
from dotenv import load_dotenv # type: ignore
import os
import nltk # type: ignore

# remove nltk downloads for docker
# nltk.download('punkt')
# nltk.download('stopwords')
load_dotenv()
api_key = os.getenv("GROQ_SECRET_KEY")

app = FastAPI()
client = Groq(
    api_key=api_key,
)

def detect_sensitive_info(tokens):
  patterns = {
    "phone_numbers": r"\b\d{3}[-.\s]??\d{3}[-.\s]??\d{4}\b",
    "emails": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
    "ssns": r"\b\d{3}-\d{2}-\d{4}\b",
    "addresses": r"\b\d{1,5}\s(?:[A-Za-z0-9#]+\s?)+,\s(?:[A-Za-z]+\s?)+,\s[A-Z]{2}\s\d{5}(-\d{4})?\b"
  }
  
  detected_info = {key: [] for key in patterns}
  for token in tokens:
    for key, pattern in patterns.items():
      if re.search(pattern, token):
        detected_info[key].append(token)
  
  return detected_info


@app.get("/getIsDataSafe")
def determinePostSafe(input_text: str = Query(..., description="Input string to minimize unnecessary words")):
  # use NLTK
  stop_words = set(stopwords.words('english'))
  tokens = word_tokenize(input_text)
  
  sensitive_info = detect_sensitive_info(tokens)
  is_safe = not any(sensitive_info[key] for key in sensitive_info)
  if not sensitive_info:
    return {
      "response": is_safe,
      "source" : "nltk"
    }
  
  # use Groq
  minimized_tokens = [token for token in tokens if token.lower() not in stop_words]
  minimized_text = " ".join(minimized_tokens)

  chat_completion = client.chat.completions.create(
      messages=[
          {
              "role": "user",
              "content": f"Data safe/not sensitive (no phone, email, external accounts, ssn, addresses) and no profanity? RESPOND T or F ONLY! \"{minimized_text}\"",
          }
      ],
      model="gemma2-9b-it",
  )

  response = chat_completion.choices[0].message.content.strip()
  if response == "F": response = False
  else: response = True
  return {
    "response": response,
    "source":"groq"
  }