'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { siteConfig } from '@/lib/content';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(progress * value);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-4xl font-extrabold text-white sm:text-5xl">
      {display}
      {suffix}
    </span>
  );
}

const stats = [
  { value: siteConfig.stats.members, label: 'Anggota Komunitas' },
  { value: siteConfig.stats.eventsCompleted, label: 'Kegiatan Selesai' },
  { value: siteConfig.stats.trainingDelivered, label: 'Pelatihan Diberikan' },
  { value: siteConfig.stats.competitions, label: 'Lomba Terkurasi' },
];

export function StatsBar() {
  return (
    <section className="relative z-10 -mt-40 w-full border-y border-white/10 bg-black/80 px-4 py-12 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <AnimatedNumber value={stat.value} suffix="+" />
            <p className="mt-2 text-sm text-zinc-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
