import { NextResponse } from "next/server";
import { deleteSession, clearSessionCookie, getCurrentUser } from "@/lib/auth";

export async function POST() {
  const user = await getCurrentUser();

  if (user) {
    const cookieStore = await import("next/headers").then((m) =>
      m.cookies()
    );
    const token = cookieStore.get("session")?.value;
    if (token) {
      await deleteSession(token);
    }
  }

  const headers = clearSessionCookie();
  return NextResponse.json({ success: true }, { status: 200, headers });
}
