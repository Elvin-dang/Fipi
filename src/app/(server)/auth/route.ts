import { admin } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("X-Forwarded-For") ||
    req.headers.get("X-Real-IP") ||
    req.headers.get("cf-connecting-ip");

  const uid = v4();

  const token = await admin.auth().createCustomToken(uid, { id: uid });

  return NextResponse.json({ id: uid, token, public_ip: ip });
}
