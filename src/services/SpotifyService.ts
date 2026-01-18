import {encode as base64Encode} from 'base-64';
import {SpotifyAlbum} from '../types/spotifyTypes';

const clientId = "0abd7f4c8860445badf3e196c4e12b79";
const clientSecret = "3c9b5dad94c044f89513726a8c6ffac3";

const getAccessToken = async () => {
 const authHeader = base64Encode(`${clientId}:${clientSecret}`);

 try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            Authorization: `Basic ${authHeader}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
    });

    const data = await response.json();
    return data.access_token;
 } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
 }
};

export const searchAlbums = async (query: String) => {
    const token = await getAccessToken();

    if (!token) return [];

    try {
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=10`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        return data.albums.items.map((album: SpotifyAlbum) => ({
            id: album.id,
            name: album.name,
            artist: album.artist,
            releaseDate: album.releaseDate,
            artwork: album.artwork,
            thumbnail: album.thumbnail
        }));
    }
    catch (error) {
        console.error("Error searching albums:", error);
        return [];
    }
};