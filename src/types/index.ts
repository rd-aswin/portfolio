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
