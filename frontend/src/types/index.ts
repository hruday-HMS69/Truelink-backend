export interface User {
  id: string;
  email: string;
  full_name: string;
  email_verified: boolean;
  created_at: string;
}

export interface ProfessionalProfile {
  headline?: string;
  summary?: string;
  location?: string;
  website?: string;
  current_position?: string;
  current_company?: string;
}
