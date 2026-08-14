import json
import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY)


def parse_search_query(user_query: str):
    prompt = f"""
You are an AI assistant for a bus ticket booking system.

Extract the following information from the customer's request:

- origin
- destination
- date
- time_period
- bus_type
- max_price

Rules:
- Return ONLY valid JSON.
- If a field is not mentioned, return null.
- bus_type must be one of: AC, NON-AC, SLEEPER.
- time_period must be one of: morning, afternoon, evening, night.
- date must be in YYYY-MM-DD format if mentioned.
- max_price must be a number if mentioned.

Customer request:
"{user_query}"

Return exactly:

{{
    "origin": null,
    "destination": null,
    "date": null,
    "time_period": null,
    "bus_type": null,
    "max_price": null
}}
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt
    )

    text = response.text.strip()

    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    return json.loads(text)