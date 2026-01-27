import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DiaryEntry } from '../../types';

interface AlbumCardProps {
  entry: DiaryEntry;
  onPress: () => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ entry, onPress }) => {
  const renderStars = (rating: number) => {
    return `${rating} / 10`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {entry.album.artwork ? (
        <Image
          source={{ uri: entry.album.artwork }}
          style={styles.coverImage}
        />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Text style={styles.placeholderText}>Album Art</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{entry.album.title}</Text>
        <Text style={styles.artist}>{entry.album.artist}</Text>
        <Text style={styles.rating}>Rating: {entry.rating}/10</Text>
        <Text style={styles.review} numberOfLines={2}>
          {entry.review}
        </Text>
        <Text style={styles.date}>
          Listened: {new Date(entry.dateListen).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  coverPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    marginBottom: 8,
  },
  review: {
    fontSize: 12,
    color: '#555',
    marginBottom: 8,
  },
  date: {
    fontSize: 11,
    color: '#999',
  },
});
