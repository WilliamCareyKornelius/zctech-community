'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users } from 'lucide-react';
import { siteConfig } from '@/lib/content';

interface DiscordData {
  memberCount: number | null;
  onlineCount: number | null;
  guildId: string | null;
}

export function DiscordCTA() {
  const [data, setData] = useState<DiscordData>({ memberCount: null, onlineCount: null, guildId: null });

  useEffect(() => {
    fetch('https://discord.com/api/invites/s67RfATTBk?with_counts=true&with_expiration=true')
      .then((res) => res.json())
      .then((json) => {
        setData({
          memberCount: json.approximate_member_count,
          onlineCount: json.approximate_presence_count,
          guildId: json.guild?.id,
        });
      })
      .catch(() => {
        setData({ memberCount: siteConfig.stats.members, onlineCount: null, guildId: null });
      });
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto flex max-w-5xl flex-col items-center text-center"
      >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
          <MessageCircle className="h-8 w-8" />
        </div>

        <h2 className="text-3xl font-bold text-white sm:text-5xl">Gabung Komunitas Discord</h2>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Jadilah bagian dari ekosistem talenta cybersecurity Indonesia. Diskusi, tanya jawab, dan ikut event langsung di Discord.
        </p>

        <div className="mt-8 flex items-center gap-6">
          <div className="flex items-center gap-2 text-zinc-300">
            <Users className="h-5 w-5 text-emerald-400" />
            <span className="font-bold">{data.memberCount ?? '...'}</span>
            <span className="text-sm text-zinc-500">anggota</span>
          </div>
          {data.onlineCount !== null && (
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-bold">{data.onlineCount}</span>
              <span className="text-sm text-zinc-500">online</span>
            </div>
          )}
        </div>

        <a
          href={siteConfig.discordInvite}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-8 py-4 text-sm font-bold text-black transition hover:bg-emerald-300"
        >
          Gabung Discord
          <MessageCircle className="h-4 w-4" />
        </a>

        {data.guildId && (
          <div className="mt-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 p-2 backdrop-blur">
            <iframe
              src={`https://discord.com/widget?id=${data.guildId}&theme=dark`}
              width="100%"
              height="350"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              title="Discord widget"
              className="rounded-xl"
            />
          </div>
        )}
      </motion.div>
    </section>
  );
}
