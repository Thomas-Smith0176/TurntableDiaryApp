// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"


Deno.serve(async (req) => {
  try {
    const { username } = await req.json();
    const API_KEY = Deno.env.get('LASTFM_API_KEY');

    if (!username) return new Response("Username required", { status: 400 });

    const url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${API_KEY}&format=json&limit=30`;

    const res = await fetch(url);
    const data = await res.json();

    // Last.fm returns an array of tracks; we want unique albums
    const tracks = data.recenttracks.track;
    const uniqueAlbums = [];
    const seen = new Set();

    for (const track of tracks) {
      const albumName = track.album['#text'];
      const artistName = track.artist['#text'];
      const combo = `${artistName}-${albumName}`;

      if (albumName && !seen.has(combo)) {
        seen.add(combo);
        uniqueAlbums.push({
          title: albumName,
          artist: artistName,
          // Last.fm provides images in an array: 0=s, 1=m, 2=l, 3=xl
          artwork: track.image[3]['#text'] || track.image[2]['#text'],
          date: track.date?.['#text'] || 'Now Playing'
        });
      }
    }

    return new Response(JSON.stringify(uniqueAlbums), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-lastfm-recent' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
