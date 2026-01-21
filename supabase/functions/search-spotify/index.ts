
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

serve(async (req) => {
  const clientId = Deno.env.get('SPOTIFY_CLIENT_ID');
  const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET'); 

  //Get Spotify Token
  const authRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const { access_token } = await authRes.json();

  // 2. Search Spotify
  const searchRes = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=10`,
    { headers: { "Authorization": `Bearer ${access_token}` } }
  );
  const data = await searchRes.json();

  return new Response(JSON.stringify(data.albums.items), {
    headers: { "Content-Type": "application/json" },
  });
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/search-spotify' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImI4MTI2OWYxLTIxZDgtNGYyZS1iNzE5LWMyMjQwYTg0MGQ5MCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODQyODkxNzN9.-7lk60jSpBAXLRpRGmg-1MKRiwi2WxFoh_pqhnwDDBaXnmwpLSDP2xc66y2m23ZbwN5XjV3hNvg-QaGsDwPM7g' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
