import {SpotifyAlbum} from '../types/spotifyTypes';
import Config from 'react-native-config';

export const searchAlbums = async (query: string): Promise<SpotifyAlbum[]> => {
    try {
        const supabaseUrl = Config.SUPABASE_URL;
        const supabaseAnonKey = Config.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('Missing Supabase configuration');
            return [];
        }

        console.log('Searching for:', query);

        const response = await fetch(
            `${supabaseUrl}/functions/v1/search-spotify`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseAnonKey}`,
                },
                body: JSON.stringify({ query }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Spotify search error:', `${response.status}: ${errorText}`);
            return [];
        }

        const data = await response.json();

        // Handle the response data structure
        if (!data || !Array.isArray(data)) {
            console.warn('Unexpected response format from Spotify search:', data);
            return [];
        }

        return data.map((album: any) => ({
            id: album.id,
            name: album.name,
            artist: album.artists?.[0]?.name || 'Unknown Artist',
            releaseDate: album.release_date,
            artwork: album.images?.[0]?.url,
            thumbnail: album.images?.[1]?.url || album.images?.[0]?.url,
        }));
    } catch (error) {
        console.error('Error searching albums:', error);
        return [];
    }
};