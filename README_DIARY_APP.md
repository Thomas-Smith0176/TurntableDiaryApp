# Recordbox Diary App

A React Native app for music enthusiasts to document, rate, and review the albums they listen to.

## Features

- **Album Diary**: Log albums you listen to with detailed information
- **Rating & Reviews**: Rate albums on a 5-star scale and write personal reviews
- **Profile Dashboard**: View statistics including:
  - Total albums logged
  - Average rating
  - Top genres
  - Top-rated albums
- **Album Management**: Edit, delete, and favorite your album entries

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
cd RecordboxDiaryApp
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

### HomeScreen
- Displays all logged albums in a feed
- Shows album cover (placeholder), title, artist, rating, review snippet, and date
- "Add Album" button to create new entries
- Empty state when no albums are logged

### AddEntryScreen
- Form to add new album entries
- Fields: Album Title, Artist, Genre, Number of Tracks, Rating, Review
- Interactive star rating selector
- Form validation

### AlbumDetailScreen
- Full album details with all information
- Edit mode to update review and rating
- Delete functionality with confirmation
- Add/remove from favorites
- Display listened date and track count

### ProfileScreen
- Statistics: Total albums, average rating, top genres
- Top rated albums list
- Genre distribution
- Quick stats overview

## Data Management

The app uses **React Context** for state management with a mock **AlbumService** that stores data in memory. 

### Future Enhancements:
- Replace AlbumService with AsyncStorage for persistent local storage
- Add Firebase/backend integration for cloud sync
- Implement user authentication
- Add album search via external APIs (Last.fm, Spotify)
- Social features (share reviews, follow friends)
- Image upload for album covers

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

## Notes

- Data is stored in memory and will be lost on app restart
- To add persistent storage, integrate AsyncStorage or a database
- Cover images use placeholder UI; implement image upload for custom images
