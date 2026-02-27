import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DiaryEntry } from '../../types';

interface AlbumCardProps {
  entry: DiaryEntry;
  onPress: () => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ entry, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.container}>
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
          <Text style={styles.title} numberOfLines={2}>{entry.album.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{entry.album.artist}</Text>
          <Text style={styles.rating}>{entry.rating}/10</Text>
          <Text style={styles.review} numberOfLines={2}>
            {entry.review}
          </Text>
          <Text style={styles.date}>
            {new Date(entry.dateListen).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    height: 140,
    borderWidth: 1,
    borderColor: '#e8e8e8'
  },
  coverImage: {
    width: 140,
    height: 140,
  },
  coverPlaceholder: {
    width: 140,
    height: 140,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  artist: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  review: {
    fontSize: 11,
    color: '#555',
    marginBottom: 4,
    lineHeight: 16,
  },
  date: {
    fontSize: 10,
    color: '#999',
  },
});
