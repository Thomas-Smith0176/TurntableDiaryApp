import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDiary } from '../context/DiaryContext';

export const ProfileScreen: React.FC = () => {
  const { entries, averageRating } = useDiary();

  const topRatedAlbums = [...entries]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const genreCount: Record<string, number> = {};
  entries.forEach(entry => {
    const genre = entry.album.genre || 'Unknown';
    genreCount[genre] = (genreCount[genre] || 0) + 1;
  });

  const topGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{entries.length}</Text>
          <Text style={styles.statLabel}>Albums Logged</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{averageRating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{topGenres.length}</Text>
          <Text style={styles.statLabel}>Top Genres</Text>
        </View>
      </View>

      {topGenres.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Genres</Text>
          {topGenres.map(([genre, count]) => (
            <View key={genre} style={styles.genreItem}>
              <Text style={styles.genreName}>{genre}</Text>
              <Text style={styles.genreCount}>{count} album{count > 1 ? 's' : ''}</Text>
            </View>
          ))}
        </View>
      )}

      {topRatedAlbums.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Rated Albums</Text>
          {topRatedAlbums.map(entry => (
            <View key={entry.id} style={styles.albumItem}>
              <View>
                <Text style={styles.albumTitle}>{entry.album.title}</Text>
                <Text style={styles.albumArtist}>{entry.album.artist}</Text>
              </View>
              <Text style={styles.rating}>{'⭐'.repeat(entry.rating)}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  genreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  genreName: {
    fontSize: 14,
    fontWeight: '500',
  },
  genreCount: {
    fontSize: 14,
    color: '#666',
  },
  albumItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  albumTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  albumArtist: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  rating: {
    fontSize: 14,
  },
});
