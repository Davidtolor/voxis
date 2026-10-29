import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env if exists
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

NEBIUS_API_KEY = os.getenv("NEBIUS_API_KEY", "")
NEBIUS_BASE_URL = os.getenv("NEBIUS_BASE_URL", "https://api.tokenfactory.nebius.com/v1")
MODEL_NEMOTRON_NANO = os.getenv("MODEL_NEMOTRON_NANO", "nvidia/nemotron-mini-4b-instruct")
MODEL_NEMOTRON_ULTRA = os.getenv("MODEL_NEMOTRON_ULTRA", "nvidia/nemotron-3-70b-instruct")

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")
PORT = int(os.getenv("PORT", "8000"))
VOXIS_ENV = os.getenv("VOXIS_ENV", "development")
