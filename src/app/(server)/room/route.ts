import type { NextRequest } from "next/server";
import { geolocation, ipAddress } from "@vercel/functions";

export function GET(req: NextRequest) {
  const geo = geolocation(req);
  const ip = ipAddress(req);
  console.log(geo, ip);
}
