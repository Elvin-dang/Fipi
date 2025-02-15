import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const secret = "qwerty";

export function GET(req: NextRequest) {
  const ip =
    req.headers.get("X-Forwarded-For") ||
    req.headers.get("X-Real-IP") ||
    req.headers.get("cf-connecting-ip");
  // @ts-ignore
  const name = crypto.createHmac("md5", secret).update(ip).digest("hex");

  return NextResponse.json({ name });
}
