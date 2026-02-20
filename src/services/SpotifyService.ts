import {SpotifyAlbum, RecentlyPlayedResponse} from '../types/spotifyTypes';
import Constants from 'expo-constants';

export const searchAlbums = async (query: string): Promise<SpotifyAlbum[]> => {
    try {
        const config = Constants.expoConfig?.extra || {};
        const supabaseUrl = config.SUPABASE_URL;
        const supabaseAnonKey = config.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('Supabase configuration is missing');
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
            url: album.external_urls?.spotify,
        }));
    } catch (error) {
        console.error('Error searching albums:', error);
        return [];
    }
};

export const getUniqueRecentAlbums = (data: RecentlyPlayedResponse): SpotifyAlbum[] => {
    const uniqueAlbums: SpotifyAlbum[] = [];
    const seenIds = new Set<string>();
    for (const item of data.items) {
        const album = item.track.album;

        if (!seenIds.has(album.id)) {
            seenIds.add(album.id);
            uniqueAlbums.push(album);
        }
    }
    return uniqueAlbums;
};