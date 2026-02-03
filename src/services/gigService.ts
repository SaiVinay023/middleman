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

}