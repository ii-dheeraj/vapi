import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

function corsHeaders(origin?: string) {
  const allowed = process.env.NEXT_PUBLIC_APP_URL || origin || "";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Request-ID",
    "Access-Control-Max-Age": "86400",
  } as Record<string, string>;
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") ?? undefined;
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") ?? undefined;
    const requestId = req.headers.get("x-request-id") || crypto.randomUUID();
    // Optional auth: if TOKEN_ROUTE_SECRET is set, require Authorization: Bearer <secret>
    const routeSecret = process.env.TOKEN_ROUTE_SECRET;
    if (routeSecret) {
      const auth = req.headers.get("authorization") || "";
      const ok = auth.toLowerCase().startsWith("bearer ") && auth.slice(7).trim() === routeSecret;
      if (!ok) {
        console.warn(`[token-route] 401 requestId=${requestId} reason=unauthorized`);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders(origin) });
      }
    }
    const { roomName, userName } = await req.json();
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      console.error(`[token-route] misconfig requestId=${requestId}`);
      return NextResponse.json(
        { error: 'Server misconfiguration' },
        { status: 500 }
      );
    }

    if (!roomName || !userName) {
      return NextResponse.json(
        { error: 'Missing roomName or userName' },
        { status: 400 }
      );
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: userName,
    });
    
    at.addGrant({ roomJoin: true, room: roomName });
    const token = await at.toJwt();

    const res = NextResponse.json({ token, wsUrl }, { headers: corsHeaders(origin) });
    console.log(`[token-route] 200 requestId=${requestId} room=${roomName} user=${userName}`);
    return res;
  } catch (error) {
    const requestId = crypto.randomUUID();
    console.error(`[token-route] 500 requestId=${requestId} error=`, error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
