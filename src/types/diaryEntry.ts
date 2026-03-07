export interface NewDiaryEntry {
  spotifyId: string;
  title: string;
  artist: string;
  releaseDate: string;
  artworkUrl: string;
  rating: number;
  review: string;
  dateListened: string; // ISO Date string YYYY-MM-DD
  url?: string;
}