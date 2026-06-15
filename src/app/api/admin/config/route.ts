import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const getAdminSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createClient(url, key);
};

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

export async function GET(req: Request) {
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("site_config")
      .select("*")
      .eq("id", "main")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data && !isAuthorized(req)) {
      delete data.telegram_bot_token;
      delete data.telegram_chat_id;
    }

    return NextResponse.json(data);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const supabase = getAdminSupabase();
    
    const { data, error } = await supabase
      .from("site_config")
      .upsert({
        id: "main",
        owner_name: body.owner_name,
        tagline: body.tagline,
        about_text: body.about_text,
        availability_status: body.availability_status,
        phone_number: body.phone_number,
        email_address: body.email_address,
        resume_url: body.resume_url,
        focus_working_on: body.focus_working_on,
        focus_learning: body.focus_learning,
        focus_goal: body.focus_goal,
        jamming_to: body.jamming_to,
        tech_stack: body.tech_stack,
        github_url: body.github_url,
        linkedin_url: body.linkedin_url,
        telegram_bot_token: body.telegram_bot_token,
        telegram_chat_id: body.telegram_chat_id,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
