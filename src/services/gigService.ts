import { supabase } from '@/lib/supabase'

export const GigService = {
  // Fetch all available gigs (using your unrestricted view)
 async getAvailableGigs(filters?: { query?: string }) {
    let query = supabase
      .from('active_gigs')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.query) {
      query = query.ilike('title', `%${filters.query}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Fetch gigs assigned to the current technician
  async getMyGigs(userId: string) {
    const { data, error } = await supabase
      .from('gigs')
      .select('*')
      .eq('technician_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Logic: Claim a gig
  async claimGig(gigId: string, userId: string) {
    const { data, error } = await supabase
      .from('gigs')
      .update({ 
        technician_id: userId, 
        status: 'assigned' 
      })
      .eq('id', gigId)
      .select()

    if (error) throw error
    return data
  },

  async updateGigStatus(gigId: string, newStatus: 'in_progress' | 'pending_review' | 'completed') {
  const { data, error } = await supabase
    .from('gigs')
    .update({ status: newStatus })
    .eq('id', gigId)
    .select()
    .single();

  if (error) throw error;
  return data;
},

async submitCompletion(gigId: string, cloudinaryUrl: string) {
    const { data, error } = await supabase
      .from('gigs')
      .update({ 
        status: 'pending_review',
        completion_photo_url: cloudinaryUrl 
      })
      .eq('id', gigId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getBalance(userId: string) {
    const { data, error } = await supabase
      .from('gigs')
      .select('pay_amount, status')
      .eq('technician_id', userId)
      .in('status', ['pending_review', 'completed']);

    if (error) throw error;

    // Logic: 'completed' = Ready to withdraw, 'pending_review' = Processing
    const pending = data
      ?.filter(g => g.status === 'pending_review')
      .reduce((sum, g) => sum + (g.pay_amount || 0), 0) || 0;

    const available = data
      ?.filter(g => g.status === 'completed')
      .reduce((sum, g) => sum + (g.pay_amount || 0), 0) || 0;

    return { pending, available };
  }

}