import { supabase } from "supabase/supabaseClient";
import { DiaryEntry as NewEntryType } from "../types/diaryEntry";
import { DiaryEntry as AppDiaryEntry } from "../types";

export const saveDiaryEntry = async (entry: NewEntryType) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not logged in');

        const { error: albumError } = await supabase
        .from('albums')
        .upsert({
            id: entry.spotifyId,
            title: entry.title,
            artist: entry.artist,
            release_date: entry.releaseDate,
            artwork_url: entry.artworkUrl,
            user_id: user.id,
            album_url: entry.url,
        }, { onConflict: 'id', ignoreDuplicates: true });

        if (albumError) throw albumError;

        const { error: entryError } = await supabase
        .from('diary_entries')
        .insert({
            user_id: user.id,
            album_id: entry.spotifyId,
            rating: entry.rating,
            review: entry.review,
            date_listened: entry.dateListened,
        });

        if (entryError) throw entryError;

        return { success: true };

    } catch (error) {
        console.error('Error saving diary entry:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

export const getDiaryEntries = async (): Promise<AppDiaryEntry[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not logged in');

        // Fetch diary entries
        const { data: entries, error: entriesError } = await supabase
            .from('diary_entries')
            .select(`id, rating, review, date_listened, created_at, album_id`)
            .eq('user_id', user.id)
            .order('date_listened', { ascending: false });

        if (entriesError) throw entriesError;
        if (!entries || entries.length === 0) return [];

        // Extract unique album_ids
        const albumIds = Array.from(new Set(entries.map((e: any) => e.album_id)));

        // Fetch albums for this user
        const { data: albums, error: albumsError } = await supabase
            .from('albums')
            .select(`id, title, artist, release_date, artwork_url, album_url`)
            .eq('user_id', user.id)
            .in('id', albumIds);

        if (albumsError) throw albumsError;

        // Create a map of album id -> album data for quick lookup
        const albumMap = (albums || []).reduce((acc: any, album: any) => {
            acc[album.id] = album;
            return acc;
        }, {});

        // Map entries with their album data
        const mapped: AppDiaryEntry[] = entries.map((row: any) => {
            const albumData = albumMap[row.album_id];
            return {
                id: row.id,
                album: {
                    id: albumData?.id ?? row.album_id,
                    title: albumData?.title ?? '',
                    artist: albumData?.artist ?? '',
                    releaseDate: albumData?.release_date ?? '',
                    artwork: albumData?.artwork_url ?? undefined,
                    url: albumData?.album_url ?? undefined,
                    latestRating: albumData?.latest_rating ?? 0,
                },
                rating: row.rating,
                review: row.review,
                dateListen: row.date_listened,
                createdAt: row.created_at,
            };
        });

        return mapped;

    } catch (error) {
        console.error('Error fetching diary entries:', error);
        return [];
    }
};

export const updateDiaryEntry = async (id: string, updates: Partial<{ rating: number; review: string; date_listened: string }>) => {
    console.log('Attempting to update diary entry with ID:', id, 'and updates:', updates);
    try {
        const { error } = await supabase
            .from('diary_entries')
            .update(updates)
            .eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error updating diary entry:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

export const deleteDiaryEntry = async (id: string) => {
    console.log('Attempting to delete diary entry with ID:', id);
    try {
        const { error } = await supabase
            .from('diary_entries')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting diary entry:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};