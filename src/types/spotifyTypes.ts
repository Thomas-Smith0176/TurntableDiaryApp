export interface SpotifyAlbum {
    id: string;
    name: string;
    artist: string;
    releaseDate: string;
    artwork: string | undefined;
    thumbnail: string | undefined;
    url: string | undefined;
}

interface PlayHistoryObject {
    track: {
        album: SpotifyAlbum;
        id: string;
        name: string;
    };
    played_at: string;
}

export interface RecentlyPlayedResponse {
    items: PlayHistoryObject[];
    next: string | null;
    cursors: {
        after: string;
        before: string;
    };
    limit: number;
}