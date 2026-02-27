import { supabase } from "supabase/supabaseClient";
import { Album } from "../types";
import { useDiary } from "@/context/DiaryContext";
import { TopArtist } from "@/types/topArtist";

export const getUserAlbums = async (): Promise<Album[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not logged in');

        // Fetch all albums for the user
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

export const getTopRatedAlbumsFromDiary = async (): Promise<Album[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not logged in');

        // Fetch all diary entries for the user
        const { data: entries, error: entriesError } = await supabase
            .from('diary_entries')
            .select(`id, rating, album_id`)
            .eq('user_id', user.id);

        if (entriesError) throw entriesError;
        if (!entries || entries.length === 0) return [];

        // Extract unique album IDs
        const albumIds = Array.from(new Set(entries.map((e: any) => e.album_id)));

        // Fetch album details
        const { data: albums, error: albumsError } = await supabase
            .from('albums')
            .select(`id, title, artist, release_date, artwork_url, album_url`)
            .in('id', albumIds);

        if (albumsError) throw albumsError;

        // Create a map of album id -> album data
        const albumMap = (albums || []).reduce((acc: any, album: any) => {
            acc[album.id] = album;
            return acc;
        }, {});

        // Group entries by album_id and get the highest rating for each
        const topRatedByAlbum: { [key: string]: Album } = {};

        entries.forEach((entry: any) => {
            const albumData = albumMap[entry.album_id];
            if (!albumData) return;

            if (!topRatedByAlbum[entry.album_id]) {
                topRatedByAlbum[entry.album_id] = {
                    id: albumData.id,
                    title: albumData.title,
                    artist: albumData.artist,
                    releaseDate: albumData.release_date,
                    artwork: albumData.artwork_url ?? undefined,
                    url: albumData.album_url ?? undefined,
                    latestRating: entry.rating,
                };
            } else {
                // Keep the highest rating
                topRatedByAlbum[entry.album_id].latestRating = Math.max(
                    topRatedByAlbum[entry.album_id].latestRating,
                    entry.rating
                );
            }
        });

        // Convert to array and sort by rating
        const topRated = Object.values(topRatedByAlbum)
            .sort((a, b) => b.latestRating - a.latestRating);

        return topRated;

    } catch (error) {
        console.error('Error fetching top rated albums from diary:', error);
        return [];
    }
};

export const getTopRatedArtistsFromDiary = async (): Promise<TopArtist[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not logged in');

        // Fetch all diary entries for the user
        const { data: entries, error } = await supabase
            .from('diary_entries')
            .select(`rating, albums(artist)`)
            .eq('user_id', user.id);

        if (error) throw error;
        if (!entries || entries.length === 0) return [];

        // Group ratings by Artist to calculate sums and counts
        const artistStats: { [artistName: string]: { totalRating: number; count: number } } = {};

        entries.forEach((entry: any) => {
            const artistName = entry.albums?.artist;
            const rating = entry.rating;
            
            // Skip if we couldn't find the album or if there is no rating
            if (!artistName || rating == null) return; 

            if (!artistStats[artistName]) {
                artistStats[artistName] = { totalRating: 0, count: 0 };
            }

            artistStats[artistName].totalRating += rating;
            artistStats[artistName].count += 1;
        });

        // Calculate averages, convert to array, and sort
        const topRatedArtists: TopArtist[] = Object.keys(artistStats).map((artistName) => {
            const stats = artistStats[artistName];
            return {
                artist: artistName,
                averageRating: Number((stats.totalRating / stats.count).toFixed(1))
            };
        }).sort((a, b) => b.averageRating - a.averageRating); 

        return topRatedArtists;

    } catch (error) {
        console.error('Error fetching top rated artists from diary:', error);
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