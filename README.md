# Jukebox Diary App

A streamlined app for music enthusiasts to document, rate, and review the albums they listen to.

## Features

- **Album Diary**: Log, rate, and write personal reviews for albums you listen to.
- **Album Lists**: Create personalised lists based on your favourite artists, and genres, and years of music.
- **Streaming Sync**: View your recent albums from any streaming service via Last Fm.
- **Trending Feed**: Create entries based of a feed of nationally trending releases.
- **Profile Dashboard**: View statistics including your total listens, avergae rating, and top rated artists and albums.

## Project Structure

```
src/
├── components/
│   └── AlbumCard.tsx          # Album entry card component
├── context/
│   └── DiaryContext.tsx       # Global state management using React Context
├── navigation/
│   └── RootNavigator.tsx      # Navigation setup with bottom tabs
├── screens/
│   ├── HomeScreen.tsx         # Main diary feed
│   ├── AddEntryScreen.tsx     # Form to add new album entries
│   ├── AlbumDetailScreen.tsx  # Album details, edit, delete
│   └── ProfileScreen.tsx      # User profile and statistics
├── services/
│   └── AlbumService.ts        # Business logic for album management
└── types/
    └── index.ts               # TypeScript type definitions
```

## Setup Instructions

### Prerequisites

- Node.js >= 20
- npm or yarn
- React Native CLI
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. Navigate to the project directory:
```bash
cd JukeboxDiaryApp
```

2. Install dependencies:
```bash
npm install
```

3. Install navigation dependencies:
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-screens react-native-gesture-handler
```

### Running the App

**Start the Metro bundler:**
```bash
npm start
```

**Run on Android (in a separate terminal):**
```bash
npm run android
```

**Run on iOS (macOS only):**
```bash
npm run ios
```

## Key Components

### AlbumDiaryScreen
- Displays all logged albums in a feed
- Shows album cover, title, artist, rating, review snippet, and date
- Entries are divided into sections based on month saved

### AlbumSearchScreen
- Features search functionality utilising Spotify API
- Displays feed of internationally trending releases
- Displays feed of users recent listens (based off linked LastFm account)

### AddEntryScreen
- Form to add new album entries
- Fields: Album Title, Artist, Genre, Number of Tracks, Rating, Review
- Interactive star rating selector
- Form validation

### AlbumDetailScreen
- Full album details with all information
- Edit mode to update review and rating
- Delete functionality with confirmation
- Display listened date

### ProfileScreen
- Statistics: Total albums, average rating, top genres
- Top rated albums and artists lists
- Quick stats overview

## Data Management

## Future Enhancements:

## Development

### Run tests:
```bash
npm test
```

### Run linter:
```bash
npm run lint
```

### Format code:
```bash
npx prettier --write .
```

## Technologies Used

- React Native 0.83.1
- React 19.2.0
- React Navigation 6.x
- TypeScript 5.8.3
- Jest for testing
- ESLint for code quality
