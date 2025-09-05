import os
import asyncio
import logging
from datetime import datetime
from dotenv import load_dotenv
from livekit import agents
from livekit.agents import (
    Agent,
    AgentSession,
    RoomInputOptions,
    RoomOutputOptions,
    WorkerOptions,
    cli,
)
from livekit.plugins import google, tavus

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)


class InterviewAgent(Agent):
    def __init__(self):
        length_min = os.getenv("INTERVIEW_LENGTH_MIN", "30")
        topic = os.getenv("INTERVIEW_TOPIC", "general software engineering")
        difficulty = os.getenv("INTERVIEW_DIFFICULTY", "intermediate")

        safety_rules = (
            "Safety & Content Rules: Avoid collecting PII (addresses, IDs). "
            "Do not provide harmful, discriminatory, or illegal guidance. "
            "If user requests disallowed content, refuse and steer back to interview."
        )

        instructions = (
            "You are a structured technical interviewer. "
            f"Target duration: {length_min} minutes. Topic: {topic}. "
            f"Difficulty: {difficulty}. "
            "Greet the candidate, gather background, then progress through technical questions, "
            "a system design segment, and a short behavioral section. Finish with a concise summary and next steps. "
            "Keep answers concise and redirect back to the interview after answering candidate questions.\n" 
            + safety_rules
        )

        super().__init__(instructions=instructions)


async def entrypoint(ctx: agents.JobContext):
    # Resilience loop: auto-reconnect on error with backoff
    backoff = 1.0
    while True:
        try:
            await ctx.connect()
            # Determine target room explicitly from environment to avoid mismatches
            room_name = os.getenv("ROOM_NAME", "demo")
            logging.info(f"agent connected; target room={room_name}")

            # Google speech, language, and TTS components
            stt = google.STT(model="chirp", languages="en-US")
            llm = google.LLM(model="gemini-2.0-flash-exp", temperature=0.5)
            tts = google.TTS(language="en-US", gender="female", voice_name="", speaking_rate=1.0)

            # Create an agent session combining STT, LLM, and TTS
            session = AgentSession(stt=stt, llm=llm, tts=tts)

            # Start the Tavus avatar that will render/publish the agent's voice
            avatar = tavus.AvatarSession(
                api_key=os.environ["TAVUS_API_KEY"],
                replica_id=os.environ["TAVUS_REPLICA_ID"],
                persona_id=os.environ["TAVUS_PERSONA_ID"],
            )
            await avatar.start(session, room=room_name)
            logging.info(f"avatar session started in room={room_name}")

            # Start the agent session in the same room. Avatar publishes audio.
            await session.start(
                room=room_name,
                agent=InterviewAgent(),
                room_input_options=RoomInputOptions(audio_enabled=True),
                room_output_options=RoomOutputOptions(audio_enabled=False),  # avatar publishes audio
            )
            logging.info(f"agent session started in room={room_name}")

            await session.generate_reply("Hi, I’m your interview avatar. Ready to begin?")
            logging.info("sent greeting")

            # Hold here; in Agents SDK, the framework manages lifecycle; keep task alive
            while True:
                await asyncio.sleep(1)
        except asyncio.CancelledError:
            logging.info("agent cancelled; shutting down")
            raise
        except Exception as e:
            logging.exception(f"agent error; will retry in {backoff:.1f}s: {e}")
            await asyncio.sleep(backoff)
            backoff = min(backoff * 2, 15.0)
            continue
        finally:
            # Reset backoff after a successful connection run
            backoff = 1.0


if __name__ == "__main__":
    # Run the worker app; ensure connectivity remains stable
    cli.run_app(entrypoint, WorkerOptions())
