
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

serve(async (req) => {
  try {
    const { query } = await req.json();
    
    if (!query) {
      return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Search query:', query);

    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID');
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      console.error('Missing Spotify credentials');
      return new Response(JSON.stringify({ error: 'Spotify credentials not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Getting Spotify token...');

    //Get Spotify Token
    const authRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!authRes.ok) {
      console.error('Spotify auth failed:', authRes.status, authRes.statusText);
      return new Response(JSON.stringify({ error: 'Failed to authenticate with Spotify' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const authData = await authRes.json();
    const { access_token } = authData;

    if (!access_token) {
      console.error('No access token received from Spotify');
      return new Response(JSON.stringify({ error: 'Failed to get Spotify access token' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Searching Spotify for:', query);

    // 2. Search Spotify
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=10`,
      { headers: { "Authorization": `Bearer ${access_token}` } }
    );

    if (!searchRes.ok) {
      console.error('Spotify search failed:', searchRes.status, searchRes.statusText);
      return new Response(JSON.stringify({ error: 'Failed to search Spotify' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await searchRes.json();

    if (!data.albums || !data.albums.items) {
      console.warn('Unexpected response format from Spotify:', data);
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Found albums:', data.albums.items.length);

    return new Response(JSON.stringify(data.albums.items), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error in search-spotify function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/search-spotify' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImI4MTI2OWYxLTIxZDgtNGYyZS1iNzE5LWMyMjQwYTg0MGQ5MCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODQyODkxNzN9.-7lk60jSpBAXLRpRGmg-1MKRiwi2WxFoh_pqhnwDDBaXnmwpLSDP2xc66y2m23ZbwN5XjV3hNvg-QaGsDwPM7g' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
