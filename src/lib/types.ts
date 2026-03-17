export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  deadline?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  cv_url: string;
  status: 'New' | 'Shortlisted' | 'Rejected' | 'Closed';
  created_at: string;
  jobs?: {
    title: string;
  };
}

export interface Booking {
  id: string;
  name: string;
  company: string;
  email: string;
  contact_number: string;
  service: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Closed';
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  industry: string;
  image_url?: string;
  project_url?: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company: string;
  review: string;
  rating: number;
  photo_url?: string;
  created_at: string;
}

export interface HeroBanner {
  id: string;
  image_url: string;
  is_active: boolean;
  text_color?: string;
  secondary_text_color?: string;
  accent_text_color?: string;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  thumbnail?: string;
  tags?: string[];
  published: boolean;
  created_at: string;
}
