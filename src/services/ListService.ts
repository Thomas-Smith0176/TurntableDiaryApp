import { Album, List } from "@/types";
import { supabase } from "supabase/supabaseClient";

export interface ListEntry {
  id: string;
  list_id: string;
  created_at: string;
  list_position: number;
  album: Album;
}

export const createList = async (title: string, description: string, albumIds: string[]) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not logged in');

    // Create the list
    const { data: listData, error: listError } = await supabase
      .from('lists')
      .insert({
        title,
        description,
        user_id: user.id,
      })
      .select()
      .single();

    if (listError) throw listError;

    // Create list entries
    if (albumIds.length > 0) {
      const listEntries = albumIds.map((albumId, index) => ({
        list_id: listData.id,
        album_id: albumId,
        list_position: index + 1
      }));

      const { error: entriesError } = await supabase
        .from('list_entries')
        .insert(listEntries);

      if (entriesError) throw entriesError;
    }

    return { success: true, listId: listData.id };
  } catch (error) {
    console.error('Error creating list:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getUserLists = async (): Promise<List[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not logged in');

    const { data: lists, error } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return lists || [];
  } catch (error) {
    console.error('Error fetching lists:', error);
    return [];
  }
};

export const getListEntries = async (listId: string): Promise<ListEntry[]> => {
  try {
    const { data: entries, error } = await supabase
      .from('list_entries')
      .select(`
        id,
        list_id,
        list_position,
        created_at,
        album:albums (
          id,
          title,
          artist,
          artwork_url,
          release_date
        )
      `)
      .eq('list_id', listId)
      .order('list_position', { ascending: true });

    if (error) throw error;

    const mappedEntries: ListEntry[] = entries.map((row: any) => {
      const albumData = row.album;
      return {
        id: row.id,
        list_id: row.list_id,
        list_position: row.list_position,
        created_at: row.created_at,
        album: {
            id: albumData.id,
            title: albumData?.title ?? '',
            artist: albumData?.artist ?? '',
            releaseDate: albumData?.release_date ?? '',
            artwork: albumData?.artwork_url ?? undefined,
            url: albumData?.album_url ?? undefined,
            latestRating: albumData?.latest_rating ?? 0,
        },
      }
    })

    return mappedEntries;

  } catch (error) {
    console.error('Error fetching list entries:', error);
    return [];
  }
};

export const deleteList = async (listId: string) => {
  console.log('deleting list with id: ', listId)
  try {
    // Delete list entries first
    const { error: entriesError } = await supabase
      .from('list_entries')
      .delete()
      .eq('list_id', listId);

    if (entriesError) throw entriesError;
    console.log("deleted entries");

    // Delete the list
    const { error: listError } = await supabase
      .from('lists')
      .delete()
      .eq('id', listId);

    if (listError) throw listError;
    console.log('deleted list')

    return { success: true };
  } catch (error) {
    console.error('Error deleting list:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const updateList = async (
  listId: string, 
  listUpdates: Partial<{ title: string, description: string }>, 
  entriesUpdates: ListEntry[]
) => {
  try {
    const { error: listError } = await supabase
      .from('lists')
      .update(listUpdates)
      .eq('id', listId);

    if (listError) throw listError;

    const formattedEntries = entriesUpdates.map(entry => ({
      id: entry.id,
      list_id: listId,
      album_id: entry.album.id,
      list_position: entry.list_position
    }));

    const { error: entriesError } = await supabase
      .from('list_entries')
      .upsert(formattedEntries, { onConflict: 'id' });

    if (entriesError) throw entriesError;

    return { success: true };
  } catch (error) {
    console.error('Error updating list:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
