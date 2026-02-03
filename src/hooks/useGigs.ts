import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GigService } from '@/services/gigService'

export function useGigs(userId?: string, filters?: { query?: string }) {
  const queryClient = useQueryClient()

  // Controller: Available Gigs Feed
  const availableGigs = useQuery({
    queryKey: ['gigs', 'available', filters?.query],
    queryFn: () => GigService.getAvailableGigs(filters)
  })

  // Controller: My Assigned Gigs
  const myGigs = useQuery({
    queryKey: ['gigs', 'mine', userId],
    queryFn: () => GigService.getMyGigs(userId!),
    enabled: !!userId
  })

  // Controller: Accept Job Action
  const claimMutation = useMutation({
    mutationFn: ({ gigId, techId }: { gigId: string, techId: string }) => 
      GigService.claimGig(gigId, techId),
    onSuccess: () => {
      // Invalidate both lists so the job "moves" from Available to My Gigs
      queryClient.invalidateQueries({ queryKey: ['gigs'] })
    }
  })

  return {
    available: {
      data: availableGigs.data,
      isLoading: availableGigs.isLoading
    },
    mine: {
      data: myGigs.data,
      isLoading: myGigs.isLoading
    },
    claimGig: claimMutation.mutate,
    isClaiming: claimMutation.isPending
  }
}