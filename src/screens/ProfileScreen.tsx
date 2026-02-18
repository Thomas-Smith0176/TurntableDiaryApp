import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDiary } from '../context/DiaryContext';
import { useFocusEffect } from '@react-navigation/native';

export const ProfileScreen: React.FC = () => {
  const { albums, averageRating, loadAlbums } = useDiary();

  const topRatedAlbums = [...albums]
    .sort((a, b) => b.latestRating - a.latestRating)
    .slice(0, 5);

  useFocusEffect(
    useCallback(() => {
      loadAlbums();
    }, [])
  );

  console.log('Entries:', topRatedAlbums);
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{albums.length}</Text>
          <Text style={styles.statLabel}>Albums Logged</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{averageRating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Average Rating</Text>
        </View>
      </View>

      {topRatedAlbums.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Rated Albums</Text>
          {topRatedAlbums.map(album => (
            <View key={album.id} style={styles.albumItem}>
              <View>
                <Text style={styles.albumTitle}>{album.title}</Text>
                <Text style={styles.albumArtist}>{album.artist}</Text>
              </View>
              <Text style={styles.rating}>{album.latestRating.toFixed(1)}</Text>
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
    paddingTop: 50,
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
