import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const getAdminSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createClient(url, key);
};

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const isDemoMode = !url || !key || url === "your_supabase_project_url";

    if (isDemoMode) {
      console.warn("[Contact Route - Demo Mode] Simulating database insert and Telegram notify for:", { name, email, message });
      return NextResponse.json({ success: true, submission: { name, email, message } });
    }

    const supabase = getAdminSupabase();

    // 1. Insert message record into Supabase
    const { data: submission, error: dbError } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name,
          email,
          message,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database submission error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // 2. Fetch Telegram configurations dynamically from configuration table
    const { data: config, error: configError } = await supabase
      .from("site_config")
      .select("telegram_bot_token, telegram_chat_id")
      .eq("id", "main")
      .single();

    if (!configError && config) {
      const { telegram_bot_token, telegram_chat_id } = config;
      
      if (telegram_bot_token && telegram_chat_id) {
        // Send push alert message using Telegram Bot API
        const text = `📩 *New Contact Submission!*\n\n` +
                     `👤 *Name:* ${name}\n` +
                     `📧 *Email:* ${email}\n` +
                     `💬 *Message:* ${message}`;

        try {
          const telegramRes = await fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              chat_id: telegram_chat_id,
              text,
              parse_mode: "Markdown"
            })
          });
          
          if (!telegramRes.ok) {
            console.error("Telegram API error response:", await telegramRes.text());
          }
        } catch (tgErr) {
          console.error("Telegram connection error:", tgErr);
        }
      }
    }

    return NextResponse.json({ success: true, submission });

  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
