import os
from openai import AsyncOpenAI
from agents import set_default_openai_client, set_default_openai_api, set_tracing_disabled
from dotenv import load_dotenv
from tavily import TavilyClient

# .env file se variables load karo
load_dotenv()

# Environment variables se settings lo
BASE_URL = os.getenv("BASE_URL")
API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

# Validate karo ke sab values set hain
if not BASE_URL:
    raise ValueError("BASE_URL .env file mein set nahi hai ya khali hai.")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY .env file mein set nahi hai ya khali hai.")
if not MODEL_NAME:
    raise ValueError("MODEL_NAME .env file mein set nahi hai ya khali hai.")
if not TAVILY_API_KEY:
    raise ValueError("TAVILY_API_KEY .env file mein set nahi hai ya khali hai.")

# BASE_URL mein protocol check karo
if not BASE_URL.startswith(("http://", "https://")):
    raise ValueError(f"BASE_URL ({BASE_URL}) mein 'http://' ya 'https://' protocol missing hai.")

# AsyncOpenAI client banao
client = AsyncOpenAI(
    base_url=BASE_URL,
    api_key=API_KEY,
)

# Tavily client banao
tavily_client = TavilyClient(api_key=TAVILY_API_KEY)

# Global-Level configuration set karo
set_default_openai_client(client=client, use_for_tracing=False)
set_default_openai_api("chat_completions")
set_tracing_disabled(disabled=True)