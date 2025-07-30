'use client';

import { getRecentlyPlayed } from '@/actions/spotify/getRecentlyPlayed';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { useQuery } from '@tanstack/react-query';

export function RecentlyPlayed() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['recentlyPlayed'],
    queryFn: async () => {
      const res = await getRecentlyPlayed();
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  if (isLoading) return <div>Loading from RecentlyPlayed...</div>;
  if (error) return <div>Error loading data</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}