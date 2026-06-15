export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface SiteConfig {
  owner_name: string;
  tagline: string;
  about_text: string;
  availability_status: string;
  phone_number: string;
  email_address: string;
  resume_url?: string;
  focus_working_on?: string;
  focus_learning?: string;
  focus_goal?: string;
  jamming_to?: string;
  tech_stack?: string;
  github_url?: string;
  linkedin_url?: string;
  telegram_bot_token?: string;
  telegram_chat_id?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  tags: string;
  image_public_id: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  quote: string;
  title?: string;
  company?: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  skills: string;
  type: "work" | "education" | "award";
}
