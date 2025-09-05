# VAPI - AI Avatar Interview System

A Next.js application that enables AI-powered interviews with Tavus avatars using LiveKit for real-time communication.

## Features

- **AI Avatar Interviews**: Interactive interviews with Tavus AI avatars
- **Real-time Communication**: LiveKit integration for seamless audio/video
- **Google AI Integration**: Gemini LLM, STT, and TTS for natural conversations
- **Modern UI**: Built with Next.js, React, and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Python with LiveKit Agents SDK
- **AI Services**: 
  - Tavus (Avatar rendering)
  - Google Gemini (LLM)
  - Google STT/TTS (Speech processing)
- **Real-time**: LiveKit for WebRTC communication
- **Styling**: Tailwind CSS

## Environment Variables

### Frontend (.env.local)
```
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-domain.livekit.cloud
```

### Backend (agent/.env)
```
LIVEKIT_URL=wss://your-livekit-domain.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_secret
GEMINI_API_KEY=your_gemini_api_key
TAVUS_API_KEY=your_tavus_api_key
TAVUS_REPLICA_ID=your_replica_id
TAVUS_PERSONA_ID=your_persona_id
ROOM_NAME=demo
```

## Getting Started

### 1. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies (Python)
cd agent
pip install -r requirements.txt
```

### 2. Start the Avatar Agent

```bash
# Run the setup script (Windows)
.\scripts\setup-and-run-agent.ps1

# Or manually
cd agent
python interview_avatar.py
```

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Access the Application

Open [http://localhost:3000](http://localhost:3000) and click "Start Interview" to begin an AI avatar interview session.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── interview/[room]/  # Interview room page
│   └── globals.css        # Global styles
├── agent/                 # Python avatar agent
│   ├── interview_avatar.py # Main agent script
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Agent environment variables
├── scripts/               # Setup scripts
└── README.md             # This file
```

## How It Works

1. **User Access**: User navigates to `/interview/demo`
2. **Token Generation**: Frontend requests LiveKit token from API
3. **Room Connection**: User joins LiveKit room with audio enabled
4. **Avatar Agent**: Python agent connects to same room with Tavus avatar
5. **AI Conversation**: Gemini LLM processes speech and generates responses
6. **Avatar Rendering**: Tavus avatar renders AI responses with natural speech

## Development

- Frontend runs on `http://localhost:3000`
- Avatar agent connects to LiveKit room specified in `ROOM_NAME`
- All real-time communication handled through LiveKit WebRTC

## License

MIT License
