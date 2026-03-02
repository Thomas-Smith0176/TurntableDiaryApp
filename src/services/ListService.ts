import { Album, List } from "@/types";
import { supabase } from "supabase/supabaseClient";
import * as Crypto from 'expo-crypto';

export interface ListEntry {
  id?: string;
  listId?: number;
  createdAt?: string;
  listPosition?: number;
  albumTitle?: string;
  artist?: string;
  artwork?: string;
}

export const createList = async (title: string, description: string, albums: Partial<ListEntry>[]) => {
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
    if (albums.length > 0) {
      const listEntries = albums.map((album, index) => ({
        list_id: listData.id,
        album_title: album.albumTitle,
        artist_name: album.artist,
        artwork_url: album.artwork,
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
        album_title,
        artist_name,
        artwork_url
      `)
      .eq('list_id', listId)
      .order('list_position', { ascending: true });

    if (error) throw error;

    const mappedEntries: ListEntry[] = entries.map((row: any) => {
      return {
        id: row.id,
        listId: row.list_id,
        listPosition: row.list_position,
        createdAt: row.created_at,
        albumTitle: row.album_title,
        artist: row.artist_name ?? '',
        artwork: row.artwork_url ?? '',
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

    const formattedEntries = entriesUpdates.map(entry => {
      return {
        id: entry.id || Crypto.randomUUID(), 
        list_id: listId,
        album_title: entry.albumTitle,
        artist_name: entry.artist,
        artwork_url: entry.artwork,
        list_position: entry.listPosition
      };
    });

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
