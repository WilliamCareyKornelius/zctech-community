'use client';

import { Testimonial1 } from '@/components/ui/testimonial1';

const aminTestimonial = {
  id: 'Amin',
  text: 'ZCTech Community hadir sebagai wadah belajar bersama untuk siapa saja yang ingin memulai dan berkembang di dunia cybersecurity. Saya percaya bahwa ilmu siber harus terbuka, praktis, dan dibagi dengan etika.',
  name: 'Amin',
  role: 'Ketua ZCTech',
  avatar: { src: '/team/amin.jpg', alt: 'Amin' },
};

export function CommunityVoices() {
  return (
    <section className="w-full bg-zinc-950 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Testimonial1
          badge={{ label: 'Sambutan', variant: 'secondary' }}
          heading="Kata Ketua ZCTech"
          description="Perjalanan dan harapan komunitas dari pendamping utama kami."
          testimonials={[aminTestimonial]}
          autoplay={false}
          className="text-white py-0 md:py-0"
        />
      </div>
    </section>
  );
}
