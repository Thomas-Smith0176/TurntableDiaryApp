export interface SpotifyAlbum {
    id: string;
    name: string;
    artist: string;
    releaseDate: string;
    artwork: string | undefined;
    thumbnail: string | undefined;
    url: string | undefined;
}