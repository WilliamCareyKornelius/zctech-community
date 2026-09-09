export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  eventDate: string;
  endDate?: string;
  location: string;
  type: 'workshop' | 'meetup' | 'webinar' | 'competition';
  status: 'upcoming' | 'ongoing' | 'completed';
  regLink?: string;
  isRegistrationClosed?: boolean;
  registrationDeadline?: string;
  registrationClosedMessage?: string;
  speaker?: string;
  price?: string;
  topics?: string[];
  benefits?: string[];
}

export interface Training {
  id: string;
  slug: string;
  title: string;
  description: string;
  syllabus: string[];
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  format: 'online' | 'offline' | 'hybrid';
  prerequisites: string;
  trainer: string;
  price: string;
  isActive: boolean;
  coverImage: string;
}

export interface Competition {
  id: string;
  slug: string;
  title: string;
  organizer: string;
  description: string;
  category: string;
  deadline: string;
  prizeInfo?: string;
  externalLink: string;
  coverImage: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: 'writeup' | 'tutorial' | 'news' | 'opinion';
  tags: string[];
  author: string;
  publishedAt: string;
  readingTime: number;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  socmed: { platform: string; url: string }[];
}

export interface CoreValue {
  title: string;
  description: string;
}
