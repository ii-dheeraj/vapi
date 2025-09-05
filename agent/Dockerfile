# Python agent container for deployment
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# System deps (if any plugin needs them). Keep minimal.
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first for better layer caching
COPY agent/requirements.txt /app/agent/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/agent/requirements.txt

# Copy the agent code
COPY agent/ /app/agent/

# Default env (override at deploy time)
ENV LIVEKIT_URL="" \
    LIVEKIT_API_KEY="" \
    LIVEKIT_API_SECRET="" \
    GEMINI_API_KEY="" \
    TAVUS_API_KEY="" \
    TAVUS_REPLICA_ID="" \
    TAVUS_PERSONA_ID="" \
    INTERVIEW_LENGTH_MIN="30" \
    INTERVIEW_TOPIC="general software engineering" \
    INTERVIEW_DIFFICULTY="intermediate"

WORKDIR /app

# Entrypoint
CMD ["python", "agent/interview_avatar.py"]
