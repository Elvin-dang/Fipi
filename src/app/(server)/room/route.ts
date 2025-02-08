import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const ip = req.headers.get("X-Forwarded-For") || req.headers.get("X-Real-IP");
  return NextResponse.json({ ip });
}
