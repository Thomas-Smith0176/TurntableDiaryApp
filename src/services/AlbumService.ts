import { supabase } from "supabase/supabaseClient";
import { Album } from "../types";

export const getUserAlbums = async (): Promise<Album[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not logged in');

        const { data: albums, error: albumsError } = await supabase
            .from('albums')
            .select(`id, title, artist, release_date, artwork_url, album_url, latest_rating`)
            .eq('user_id', user.id);

        if (albumsError) throw albumsError;

        const mapped: Album[] = albums.map((row: any) => {
            return {
                id: row.id,
                title: row.title,
                artist: row.artist,
                releaseDate: row.release_date,
                artwork: row.artwork_url ?? undefined,
                url: row.album_url ?? undefined,
                latestRating: row.latest_rating ?? 0,
            };
        });

        return mapped;

    } catch (error) {
        console.error('Error fetching user albums:', error);
        return [];
    }
};

export const updateAlbumEntry = async (id: string, updates: Partial<{ latest_rating: number}>) => {
    console.log('Attempting to update album entry with ID:', id, 'and updates:', updates);
    try {
        const { error } = await supabase
            .from('albums')
            .update(updates)
            .eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error updating album entry:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};