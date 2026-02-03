import { supabase } from '@/lib/supabase'

export const AdminService = {
  // Fetch every single gig regardless of status
  async getAllGigs() {
    const { data, error } = await supabase
      .from('gigs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Create a new gig
  async createGig(gigData: { title: string, description: string, pay_amount: number, location: string }) {
    const { data, error } = await supabase
      .from('gigs')
      .insert([gigData])
      .select()

    if (error) throw error
    return data
  },

  // Delete a gig (Soft Delete recommended)
  async deleteGig(gigId: string) {
    const { error } = await supabase
      .from('gigs')
      .update({ deleted_at: new Date().toISOString() }) // Soft delete
      .eq('id', gigId)

    if (error) throw error
  }
}