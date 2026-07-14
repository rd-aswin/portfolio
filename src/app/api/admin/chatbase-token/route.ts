import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const isAuthorized = (req: NextRequest) => {
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

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = process.env.CHATBOT_IDENTITY_SECRET || "gmbau6z7fbz81hewn1g4unzdx59ezxb4";
    
    // Create JWT payload identifying the admin
    const payload = {
      user_id: "rd-aswin-admin",
      email: "aswinsithara@gmail.com",
      name: "R D Aswin",
      phonenumber: "+910000000000",
      custom_attributes: {
        "role": "Admin",
        "support_tier": "VIP",
        "company": "R D Aswin Portfolio"
      },
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
    };

    // Sign the token with the HS256 algorithm
    const token = jwt.sign(payload, secret, { algorithm: "HS256" });

    return NextResponse.json({ token });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
