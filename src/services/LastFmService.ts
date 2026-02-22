import { SuggestedAlbum } from "@/types/lastFmTypes";
import Constants from 'expo-constants';

export const getRecentAlbums = async (username: string | null): Promise<SuggestedAlbum[]> => {
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
    console.log(data)
    if (!Array.isArray(data)) return [];

    const normalizedAlbums: SuggestedAlbum[] = data.map((item: any) => ({
      albumTitle: item.title ?? '',
      artist: item.artist ?? '',
      artwork: item.artwork ?? '',
      id: item.date ?? '',
    }));

    return normalizedAlbums;
  } catch (err) {
    console.error('Error calling Last.fm service:', err);
    return [];
  }
};