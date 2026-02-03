import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GigService } from '@/services/gigService'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

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

  // Inside your useGigs hook, add this mutation
const updateStatusMutation = useMutation({
  mutationFn: ({ gigId, status }: { gigId: string, status: any }) => 
    GigService.updateGigStatus(gigId, status),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['gigs'] });
  }
})

const completeMutation = useMutation({
  mutationFn: ({ gigId, cloudinaryUrl }: { gigId: string, cloudinaryUrl: string }) => 
    GigService.submitCompletion(gigId, cloudinaryUrl),
  onSuccess: () => {
    // Refresh the 'mine' and 'available' lists
    queryClient.invalidateQueries({ queryKey: ['gigs'] });
  }
});

useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for Inserts, Updates, and Deletes
          schema: 'public',
          table: 'gigs',
        },
        (payload) => {
          // Whenever a gig changes in the DB, tell React Query to refresh the data
          queryClient.invalidateQueries({ queryKey: ['gigs'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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
    isClaiming: claimMutation.isPending,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    completeGig: completeMutation.mutate,
    isCompleting: completeMutation.isPending
  }
}