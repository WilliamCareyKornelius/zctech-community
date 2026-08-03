'use client';

import { Testimonial1 } from '@/components/ui/testimonial1';
import { team } from '@/lib/content';

const quotes = [
  'Komunitas ini jadi tempat saya belajar siber dari nol. Mentor dan materinya sangat aplikatif.',
  'Banyak event hands-on yang membantu mempercepat pemahaman saya tentang ethical hacking.',
  'Networking di ZCTech membuka peluang kolaborasi dan sharing ilmu yang sangat berharga.',
];

export function CommunityVoices() {
  const testimonials = team.slice(0, 3).map((member, index) => ({
    id: member.name,
    text: quotes[index] ?? 'Bergabung bersama ZCTech Community memberikan wawasan dan koneksi yang berharga.',
    name: member.name,
    role: member.role,
    avatar: { src: member.image, alt: member.name },
  }));

  return (
    <section className="w-full bg-black px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Testimonial1
          badge={{ label: 'Testimoni', variant: 'secondary' }}
          heading="Apa Kata Mereka"
          description="Pengalaman anggota dan mentor yang aktif dalam komunitas ZCTech."
          testimonials={testimonials}
          autoplay={false}
        />
      </div>
    </section>
  );
}
