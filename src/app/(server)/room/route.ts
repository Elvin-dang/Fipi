import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const secret = "qwerty";

export function GET(req: NextRequest) {
  const ip =
    req.headers.get("X-Forwarded-For") ||
    req.headers.get("X-Real-IP") ||
    req.headers.get("cf-connecting-ip");
  // @ts-expect-error ip always exists
  const name = crypto.createHmac("md5", secret).update(ip).digest("hex");

  console.log("ROOM SERVER IP", ip);
  console.log("ROOM SERVER NAME", name);

  return NextResponse.json({ name });
}
