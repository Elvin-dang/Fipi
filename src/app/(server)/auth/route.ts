import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";
import FirebaseTokenGenerator from "firebase-token-generator";

export function GET(req: NextRequest) {
  const ip =
    req.headers.get("X-Forwarded-For") ||
    req.headers.get("X-Real-IP") ||
    req.headers.get("cf-connecting-ip");

  // @ts-expect-error there is always a SECRET
  const firebaseTokenGenerator = new FirebaseTokenGenerator(process.env.SECRET);

  const uid = v4();
  const token = firebaseTokenGenerator.createToken({ uid, id: uid }, { expires: 32503680000 });

  return NextResponse.json({ id: uid, token, public_ip: ip });
}
