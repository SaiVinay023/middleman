export interface Gig {
  id: string;
  title: string;
  description?: string;
  pay_amount: number;
  status: 'available' | 'assigned' | 'pending_review' | 'completed';
  technician_id?: string;
  claimed_at?: string;
  completion_photo_url?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'technician' | 'admin';
  verified: boolean;
}
