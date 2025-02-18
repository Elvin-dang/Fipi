import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export function GET(req: NextRequest) {
  const ip =
    req.headers.get("X-Forwarded-For") ||
    req.headers.get("X-Real-IP") ||
    req.headers.get("cf-connecting-ip");
  // @ts-expect-error ip always exists
  const name = crypto.createHmac("md5", process.env.SECRET).update(ip).digest("hex");

  return NextResponse.json({ name });
}
