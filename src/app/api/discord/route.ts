import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch('https://discord.com/api/v10/invites/s67RfATTBk?with_counts=true&with_expiration=true', {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ memberCount: null, onlineCount: null, guildId: null }, { status: 200 });
    }

    const json = await res.json();
    return NextResponse.json({
      memberCount: json.approximate_member_count ?? null,
      onlineCount: json.approximate_presence_count ?? null,
      guildId: json.guild?.id ?? null,
    });
  } catch {
    return NextResponse.json({ memberCount: null, onlineCount: null, guildId: null }, { status: 200 });
  }
}
