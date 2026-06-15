import { NextResponse } from "next/server";

const isAuthorized = (req: Request) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const password = authHeader.substring(7);
  const correctPassword = 
    process.env.ADMIN_PASSWORD || 
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 
    "aswinadmin";
  return password === correctPassword;
};

export async function POST(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
