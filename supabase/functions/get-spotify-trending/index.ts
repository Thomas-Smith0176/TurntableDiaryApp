import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SPOTIFY_CLIENT_ID = Deno.env.get('SPOTIFY_CLIENT_ID');
const SPOTIFY_CLIENT_SECRET = Deno.env.get('SPOTIFY_CLIENT_SECRET');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const authOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    };

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', authOptions);
    const { access_token } = await tokenRes.json();

    const spotifyUrl = 'https://api.spotify.com/v1/browse/new-releases?limit=10&country=UK';
    
    const trendingRes = await fetch(spotifyUrl, {
      headers: { 'Authorization': `Bearer ${access_token}` },
    });
    
    const data = await trendingRes.json();

    const albums = data.albums.items.map((album: any) => ({
      id: album.id,
      name: album.name,
      artist: album.artists[0].name,
      artwork: album.images[0]?.url,
      releaseDate: album.release_date,
      albumUrl: album.external_urls.spotify,
    }));

    return new Response(JSON.stringify(albums), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
})