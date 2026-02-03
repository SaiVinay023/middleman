import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminService } from '@/services/adminService'

export function useAdminGigs() {
  const queryClient = useQueryClient()

  // Fetch all gigs for the admin table
  const adminGigsQuery = useQuery({
    queryKey: ['admin', 'gigs'],
    queryFn: AdminService.getAllGigs
  })

  // Create Gig Mutation
  const createMutation = useMutation({
    mutationFn: AdminService.createGig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gigs'] })
    }
  })

  // Delete Gig Mutation
  const deleteMutation = useMutation({
    mutationFn: AdminService.deleteGig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gigs'] })
    }
  })

  return {
    gigs: adminGigsQuery.data,
    isLoading: adminGigsQuery.isLoading,
    createGig: createMutation.mutate,
    deleteGig: deleteMutation.mutate,
    isCreating: createMutation.isPending
  }
}