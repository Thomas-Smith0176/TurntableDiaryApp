import { supabase } from "supabase/supabaseClient";
import { RecentAlbum } from "@/types/lastFmTypes";

export const getRecentAlbums = async (username: string): Promise<RecentAlbum[]> => {
const { data, error } = await supabase.functions.invoke('get-lastfm-recent', {
    body: { username: username },
  });

  if (error) {
    console.error('Error calling Last.fm function:', error);
    return [];
  }

  return data;
};