import { supabase } from "supabase/supabaseClient";

export interface List {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
}

export interface ListEntry {
  id: string;
  list_id: string;
  album_id: string;
  created_at: string;
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
      const listEntries = albumIds.map(albumId => ({
        list_id: listData.id,
        album_id: albumId,
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

export const getListWithEntries = async (listId: string) => {
  try {
    const { data: list, error: listError } = await supabase
      .from('lists')
      .select('*')
      .eq('id', listId)
      .single();

    if (listError) throw listError;

    const { data: entries, error: entriesError } = await supabase
      .from('list_entries')
      .select('*')
      .eq('list_id', listId);

    if (entriesError) throw entriesError;

    return { list, entries };
  } catch (error) {
    console.error('Error fetching list with entries:', error);
    return null;
  }
};

export const deleteList = async (listId: string) => {
  try {
    // Delete list entries first
    const { error: entriesError } = await supabase
      .from('list_entries')
      .delete()
      .eq('list_id', listId);

    if (entriesError) throw entriesError;

    // Delete the list
    const { error: listError } = await supabase
      .from('lists')
      .delete()
      .eq('id', listId);

    if (listError) throw listError;

    return { success: true };
  } catch (error) {
    console.error('Error deleting list:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const updateList = async (listId: string, title: string, description: string) => {
  try {
    const { error } = await supabase
      .from('lists')
      .update({ title, description })
      .eq('id', listId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating list:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
