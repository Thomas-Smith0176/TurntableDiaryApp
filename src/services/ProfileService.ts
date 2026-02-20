import { supabase } from '../../supabase/supabaseClient';

export const saveLastFmUsername = async (username: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('lastfm_users')
    .upsert({ 
      user_id: user.id, 
      username: username 
    }, { onConflict: 'user_id' });

  return { success: !error, error };
};

export const fetchLastFmUsername = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('lastfm_users')
    .select('username')
    .eq('user_id', user.id)
    .single();

  if (error || !data) return null;
  return data.username;
};