export interface Album {
  id: string;
  title: string;
  artist: string;
  releaseDate: string;
  artwork?: string;
  url: string;
  latestRating: number;
}

export interface DiaryEntry {
  id: string;
  album: Album;
  rating: number; // 1-5 stars
  review: string;
  dateListen: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  profileImage?: string;
  bio?: string;
  favoriteGenres?: string[];
  totalAlbumsLogged: number;
  memberSince: string;
}

export interface HomePageItem {
    title: string
    description: string
}
