import {SpotifyAlbum} from '../types/spotifyTypes';
import { createClient } from '@supabase/supabase-js';
import Config from 'react-native-config';

console.log('--- ENV CHECK ---');
console.log('Config Object:', Config); 
console.log('Supabase URL:', Config.SUPABASE_URL);

const supabase = createClient(
  Config.SUPABASE_URL,
  Config.SUPABASE_ANON_KEY
);

export const searchAlbums = async (query: string) => {
    const { data, error } = await supabase.functions.invoke('search-spotify', {
        body: { query },
    });
  
    if (error) return [];

    return data.albums.items.map((album: SpotifyAlbum) => ({
        id: album.id,
        name: album.name,
        artist: album.artist,
        releaseDate: album.releaseDate,
        artwork: album.artwork,
        thumbnail: album.thumbnail
    }))
};