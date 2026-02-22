// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  console.log("Recieved request for edge function get-lastfm-recent")
  try {
    const { username } = await req.json();
    const API_KEY = Deno.env.get('LASTFM_API_KEY');

    if (!username) return new Response(JSON.stringify({ error: "Username required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    if (!API_KEY) return new Response(JSON.stringify({ error: "LASTFM_API_KEY not set" }), { status: 500, headers: { "Content-Type": "application/json" } });

    const url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${API_KEY}&format=json&limit=30`;

    const res = await fetch(url);
    console.log(`Fetched recent tracks for ${username}: ${res.status}`);

    // If Last.fm returns a non-2xx, include helpful debug info in the error response
    if (res.status < 200 || res.status >= 300) {
      const text = await res.text().catch(() => '<unreadable body>');
      const preview = typeof text === 'string' ? text.slice(0, 2000) : String(text);
      const urlNoKey = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&format=json&limit=30`;
      console.error('Last.fm returned non-2xx', { status: res.status, preview });
      return new Response(JSON.stringify({ error: 'Last.fm returned non-2xx', lastfmStatus: res.status, lastfmBodyPreview: preview, request: { url: urlNoKey } }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }

    const data = await res.json().catch(() => ({}));

    // Last.fm returns an array of tracks; we want unique albums
    let tracks = data?.recenttracks?.track ?? [];
    if (!Array.isArray(tracks) && tracks) tracks = [tracks];
    const uniqueAlbums: Array<Record<string, unknown>> = [];
    const seen = new Set<string>();

    for (const track of tracks) {
      const albumName = track?.album?.['#text'];
      const artistName = track?.artist?.['#text'];
      if (!albumName || !artistName) continue;
      const combo = `${artistName}-${albumName}`;

      if (!seen.has(combo)) {
        seen.add(combo);
        const images = Array.isArray(track.image) ? track.image : [];
        let artwork = (images[3]?.['#text'] || images[2]?.['#text'] || images[1]?.['#text'] || images[0]?.['#text'] || '') as string;
        // Ensure artwork is a non-empty string
        artwork = artwork && artwork.trim() ? artwork : '';

        uniqueAlbums.push({
          title: albumName,
          artist: artistName,
          artwork,
          date: track?.date?.['#text'] || 'Now Playing'
        });
      }
    }

    return new Response(JSON.stringify(uniqueAlbums), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500, headers: { "Content-Type": "application/json" } });
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
