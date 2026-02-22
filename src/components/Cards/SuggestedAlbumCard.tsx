import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SuggestedAlbum } from '@/types/lastFmTypes';

interface SuggestedAlbumCardProps {
  suggestedAlbum: SuggestedAlbum;
  onPress: () => void;
}

export const SuggestedAlbumCard: React.FC<SuggestedAlbumCardProps> = ({ suggestedAlbum, onPress }) => {
  const hasValidArtwork = suggestedAlbum.artwork && suggestedAlbum.artwork.trim().length > 0;
  if (!hasValidArtwork) {
    console.warn('Missing or empty artwork URL for album:', suggestedAlbum.albumTitle);
  }
  const imageFormat = suggestedAlbum.artwork?.includes('.png') ? 'PNG' : 'JPG';
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.container}>
        {hasValidArtwork ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: suggestedAlbum.artwork }}
              style={styles.coverImage}
              onError={(error) => {
                console.warn('Failed to load image:', {
                  album: suggestedAlbum.albumTitle,
                  url: suggestedAlbum.artwork,
                  format: imageFormat,
                  error: error?.nativeEvent?.error || error
                });
              }}
            />
          </View>
        ) : (
          <View style={styles.coverPlaceholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{suggestedAlbum.albumTitle}</Text>
          <Text style={styles.artist} numberOfLines={1}>{suggestedAlbum.artist}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    // borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    width: 160,
    // borderWidth: 2,
    // borderColor: '#bebebe'
  },
  coverImage: {
    width: '100%',
    height: 160,

  },
  coverPlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
  },
  content: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 2,
  },
  artist: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  }
});
