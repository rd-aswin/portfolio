import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username query parameter is required" }, { status: 400 });
    }

    // Fetch GitHub's public contribution calendar page
    const res = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      next: { revalidate: 3600 } // Cache results for 1 hour
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch contributions from GitHub (status ${res.status})` }, { status: 500 });
    }

    const html = await res.text();

    // 1. Parse contribution cells to retrieve date & activity level (0-4)
    // Matches elements with class containing 'ContributionCalendar-day'
    const elementRegex = /<[a-z0-9]+[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/gi;
    const matches = html.match(elementRegex) || [];

    const days = matches
      .map((tag) => {
        const dateMatch = tag.match(/data-date="([^"]+)"/i);
        const levelMatch = tag.match(/data-level="(\d+)"/i);
        return {
          date: dateMatch ? dateMatch[1] : "",
          level: levelMatch ? parseInt(levelMatch[1], 10) : 0
        };
      })
      .filter((d) => d.date !== "");

    // Sort chronologically by date
    days.sort((a, b) => a.date.localeCompare(b.date));

    // 2. Parse total contributions count
    const totalMatch = html.match(/(\d+[,.\d]*)\s+contributions?\s+in\s+the\s+last\s+year/i) || 
                        html.match(/(\d+[,.\d]*)\s+contributions?\s+in\s+\d{4}/i) ||
                        html.match(/(\d+[,.\d]*)\s+contributions?/i);
    let totalContributions = 0;
    if (totalMatch) {
      totalContributions = parseInt(totalMatch[1].replace(/,/g, ""), 10);
    }

    // 3. Compute streaks
    let longestStreak = 0;
    let currentStreak = 0;
    for (const day of days) {
      if (day.level > 0) {
        currentStreak++;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
    }

    const levels = days.map((d) => d.level);

    return NextResponse.json({
      levels,
      totalContributions: totalContributions || levels.filter(l => l > 0).length, // Fallback if parse fails
      longestStreak
    });

  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
