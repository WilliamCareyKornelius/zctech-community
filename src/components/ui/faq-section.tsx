'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana cara bergabung dengan ZCTech Community?',
      a: 'Anda bisa langsung bergabung secara gratis melalui server Discord resmi kami di https://discord.gg/s67RfATTBk. Seluruh diskusi, pengumuman event, dan materi edukasi dibagikan di sana.',
    },
    {
      q: 'Apakah kegiatan komunitas berbayar?',
      a: 'Tidak, seluruh keanggotaan dan kegiatan rutin seperti meetup, sesi sharing, serta diskusi komunitas terbuka 100% gratis untuk siapa saja.',
    },
    {
      q: 'Apakah pemula di bidang Cybersecurity boleh bergabung?',
      a: 'Sangat disukai! Komunitas kami terdiri dari pemula hingga profesional. Kami menyediakan kanal khusus diskusi dasar dan mentoring untuk membantu anggota baru belajar.',
    },
    {
      q: 'Apa bedanya Website Organisasi (Komunitas) dan Website Bisnis ZCTech?',
      a: 'Website Organisasi (zctech.community) berfokus pada pengembangan talenta, edukasi siber, dan nirlaba. Sedangkan Website Bisnis (zctech.id) menyediakan layanan komersial profesional seperti Penetration Testing & Security Audit.',
    },
  ];

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto border-b border-zinc-900">
      <div className="text-center mb-12">
        <span className="px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 w-max mx-auto">
          <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mt-4 mb-3">
          Pertanyaan Umum
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto">
          Informasi seputar keanggotaan dan aktivitas ZCTech Community.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-zinc-950/80 border border-white/10 overflow-hidden backdrop-blur-xl"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-semibold text-sm text-zinc-100 hover:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
