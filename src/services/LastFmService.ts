import { RecentAlbum } from "@/types/lastFmTypes";
import Constants from 'expo-constants';

export const getRecentAlbums = async (username: string | null): Promise<RecentAlbum[]> => {
  try {
    if (!username) return [];

    const config = Constants.expoConfig?.extra || {};
    const supabaseUrl = config.SUPABASE_URL;
    const supabaseAnonKey = config.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase configuration is missing');
      return [];
    }

    const resp = await fetch(`${supabaseUrl}/functions/v1/get-lastfm-recent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ username }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '<unreadable>');
      console.error('Last.fm function error:', resp.status, text);
      return [];
    }

    const data = await resp.json().catch(() => []);
    if (!Array.isArray(data)) return [];

    const normalizedAlbums: RecentAlbum[] = data.map((item: any) => ({
      albumTitle: item.title ?? item.albumTitle ?? '',
      artist: item.artist ?? '',
      artwork: item.artwork ?? item.image ?? '',
      timestamp: item.date ?? item.timestamp ?? '',
    }));

    return normalizedAlbums;
  } catch (err) {
    console.error('Error calling Last.fm service:', err);
    return [];
  }
};