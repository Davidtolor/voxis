import sys
import os
import json
import urllib.request
import asyncio
from pathlib import Path
from dotenv import load_dotenv
import edge_tts

# Load environment variables from .env if present
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

if len(sys.argv) < 3:
    sys.exit(1)

raw_text = sys.argv[1].strip()
import re
is_en = bool(re.search(r'[a-zA-Z]', raw_text))
raw_text = re.sub(r'\s*[\/\\]\s*', ' or ' if is_en else ' ან ', raw_text)
raw_text = re.sub(r'\s*&\s*', ' and ' if is_en else ' და ', raw_text)

if not raw_text.endswith(('.', '!', '?')):
    text = raw_text + '.'
else:
    text = raw_text

out_file = sys.argv[2]
voice = sys.argv[3].lower() if len(sys.argv) > 3 else "bella"

rate_raw = sys.argv[4].strip() if len(sys.argv) > 4 else "-4%"
rate_clean = rate_raw.replace(' ', '').replace('%', '')
if rate_clean and (rate_clean.isdigit() or (rate_clean[0] in '+-' and rate_clean[1:].isdigit())):
    if not (rate_clean.startswith('+') or rate_clean.startswith('-')):
        rate = '+' + rate_clean + '%'
    else:
        rate = rate_clean + '%'
else:
    rate = "-4%"

def generate_elevenlabs(speak_text, out_path):
    api_key = os.getenv('ELEVENLABS_API_KEY', '').strip()
    if not api_key:
        return False
    is_english = any(c in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' for c in speak_text)

    voice_id = 'hpp4J3VqNfWAUOO0d1Us' # Bella (Exclusive Female Voice)
    stability = 0.85
    eleven_text = speak_text
    if 'პიჟამის ჩაცმა' in eleven_text:
        eleven_text = eleven_text.replace('პიჟამის ჩაცმა', 'пижамис чацма')
    elif 'პიჟამა' in eleven_text:
        eleven_text = eleven_text.replace('პიჟამა', 'пижама')
    if 'ყელი' in eleven_text:
        eleven_text = eleven_text.replace('ყელი', 'კყელი')

    url = f'https://api.elevenlabs.io/v1/text-to-speech/{voice_id}'
    payload = {
        'text': eleven_text,
        'model_id': 'eleven_v4',
        'language_code': 'en' if is_english else 'ka',
        'voice_settings': {
            'stability': stability,
            'similarity_boost': 0.85,
            'style': 0.0,
            'use_speaker_boost': True
        }
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            'xi-api-key': api_key,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
        }
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        if resp.status == 200:
            content = resp.read()
            if len(content) > 500:
                with open(out_path, 'wb') as f:
                    f.write(content)
                return True
    return False

try:
    success = generate_elevenlabs(text, out_file)
    if not success or not os.path.exists(out_file) or os.path.getsize(out_file) < 500:
        # If English, JennyNeural fallback is acceptable. For Georgian, NO Eka or Giorgi allowed!
        is_english = any(c in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' for c in text)
        if is_english:
            comm = edge_tts.Communicate(text, "en-US-JennyNeural", rate=rate)
            asyncio.run(comm.save(out_file))
        else:
            sys.exit(1)
except Exception as e:
    is_english = any(c in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' for c in text)
    if is_english:
        comm = edge_tts.Communicate(text, "en-US-JennyNeural", rate=rate)
        asyncio.run(comm.save(out_file))
    else:
        sys.exit(1)

