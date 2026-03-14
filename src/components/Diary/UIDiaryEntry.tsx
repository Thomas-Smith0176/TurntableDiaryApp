import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DiaryEntry } from '../../types';

interface UIDiaryEntryProps {
  entry: DiaryEntry;
  onPress: () => void;
}

interface UISimplifiedDiaryEntryProps {
  entry: DiaryEntry;
  onPress: () => void;
}

export const UIDiaryEntry: React.FC<UIDiaryEntryProps> = ({ entry, onPress }) => {
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
          <View style={styles.container}>
            <Text style={styles.artist} numberOfLines={1}>{entry.album.artist}</Text>
            <Text style={styles.artist} numberOfLines={1}>• {entry.album.releaseDate.slice(0, 4)}</Text>
          </View>
          <Text style={styles.rating}>{entry.rating}/10</Text>
          <Text style={styles.review} numberOfLines={1}>
            {entry.review}
          </Text>
          <Text style={styles.dateListened}>
            {new Date(entry.dateListen).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const UISimplifiedDiaryEntry: React.FC<UISimplifiedDiaryEntryProps> = ({ entry, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress}>
      <View style={styles.containerSimple}>
          {entry.album.artwork ? (
          <Image 
              source={{ uri: entry.album.artwork }} 
              style={styles.coverImageSimple} 
          />
          ) : (
          <View style={[styles.coverImageSimple, styles.coverPlaceholderSimple]} />
          )}
          <View style={styles.textContainer}>
            <Text style={styles.titleSimple}>{entry.album.title}</Text>
            <Text style={styles.artistSimple}>{entry.album.artist}</Text>
          </View>
      </View>
      </TouchableOpacity>
    )
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
    paddingVertical: 8,
    paddingHorizontal: 15,
    justifyContent: 'space-between'
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
    marginRight: 5
  },
  date: {
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
  dateListened: {
    fontSize: 10,
    color: '#999',
    alignSelf: 'flex-end'
  },

  containerSimple: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  coverImageSimple: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  coverPlaceholderSimple: {
    backgroundColor: '#e1e1e1',
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    flex: 1,
  },
  titleSimple: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  artistSimple: {
    color: 'gray',
    fontSize: 14,
  },
});
