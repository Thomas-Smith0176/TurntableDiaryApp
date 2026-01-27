import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useDiary } from '../context/DiaryContext';

interface AlbumDetailScreenProps {
  route: any;
  navigation: any;
};

export const AlbumDetailScreen: React.FC<AlbumDetailScreenProps> = ({ route, navigation }) => {
  const { entryId } = route.params;
  const { getEntryById, updateEntry, deleteEntry } = useDiary();
  const entry = getEntryById(entryId);
  const [isEditing, setIsEditing] = useState(false);
  const [review, setReview] = useState(entry?.review || '');
  const [rating, setRating] = useState(entry?.rating || 5);

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text>Album not found</Text>
      </View>
    );
  }

  const handleUpdate = () => {
    updateEntry(entryId, { review, rating });
    setIsEditing(false);
    Alert.alert('Success', 'Album updated!');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Album',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteEntry(entryId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const toggleFavorite = () => {
    updateEntry(entryId, { isFavorite: !entry.isFavorite });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.albumTitle}>{entry.album.title}</Text>
        <Text style={styles.artist}>{entry.album.artist}</Text>
        {entry.album.genre && (
          <Text style={styles.genre}>{entry.album.genre}</Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>Rating</Text>
          {isEditing ? (
            <View style={styles.ratingButtons}>
              {[1, 2, 3, 4, 5].map(num => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.ratingButton,
                    rating === num && styles.ratingButtonActive,
                  ]}
                  onPress={() => setRating(num)}
                >
                  <Text style={styles.ratingButtonText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.ratingDisplay}>
              {'⭐'.repeat(rating)}{'☆'.repeat(5 - rating)}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Review</Text>
        {isEditing ? (
          <TextInput
            style={styles.reviewInput}
            multiline
            numberOfLines={4}
            value={review}
            onChangeText={setReview}
            textAlignVertical="top"
          />
        ) : (
          <Text style={styles.reviewText}>{review || 'No review added'}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Listened on:</Text>
        <Text style={styles.value}>
          {new Date(entry.dateListen).toLocaleDateString()}
        </Text>
        {entry.album.totalTracks > 0 && (
          <>
            <Text style={styles.label}>Total Tracks:</Text>
            <Text style={styles.value}>{entry.album.totalTracks}</Text>
          </>
        )}
      </View>

      <View style={styles.actions}>
        {!isEditing ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.favoriteButton]}
              onPress={toggleFavorite}
            >
              <Text style={styles.buttonText}>
                {entry.isFavorite ? '❤️ Favorite' : '🤍 Add to Favorites'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleUpdate}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setIsEditing(false);
                setReview(entry.review);
                setRating(entry.rating);
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  albumTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  artist: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  genre: {
    fontSize: 14,
    color: '#999',
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
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
  },
  value: {
    fontSize: 14,
    marginTop: 4,
  },
  ratingContainer: {
    justifyContent: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ratingDisplay: {
    fontSize: 24,
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  ratingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  ratingButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFA500',
  },
  ratingButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
  },
  reviewInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 14,
    minHeight: 100,
  },
  actions: {
    padding: 16,
    gap: 8,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  favoriteButton: {
    backgroundColor: '#FF3B30',
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
