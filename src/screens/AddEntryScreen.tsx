import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput} from 'react-native';
import { useDiary } from '../context/DiaryContext';
import { DiaryEntry, Album } from '../types';
import StarRating from 'react-native-star-rating-widget';

interface AddEntryScreenProps {
  navigation: any;
}

export const AddEntryScreen: React.FC<AddEntryScreenProps> = ({ navigation }) => {
  const { addEntry } = useDiary();
  const [albumTitle, setAlbumTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(1);
  const [totalTracks, setTotalTracks] = useState('');

  const handleAddEntry = () => {
    if (!albumTitle.trim() || !artist.trim()) {
      Alert.alert('Error', 'Please fill in album title and artist');
      return;
    }

    const album: Album = {
      id: Math.random().toString(36).substr(2, 9),
      title: albumTitle,
      artist: artist,
      genre: genre,
      releaseDate: new Date().toISOString().split('T')[0],
      totalTracks: parseInt(totalTracks) || 0,
    };

    const entry: DiaryEntry = {
      id: Math.random().toString(36).substr(2, 9),
      album,
      rating,
      review,
      dateListen: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
    };
      
    addEntry(entry);
    Alert.alert('Success', 'Album added to your diary!');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.section}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter album title"
            value={albumTitle}
            onChangeText={setAlbumTitle}
            placeholderTextColor="#bbb"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Artist *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter artist name"
            value={artist}
            onChangeText={setArtist}
            placeholderTextColor="#bbb"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Genre</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Rock, Hip-Hop, Jazz"
            value={genre}
            onChangeText={setGenre}
            placeholderTextColor="#bbb"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Total Tracks</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of tracks"
            value={totalTracks}
            onChangeText={setTotalTracks}
            keyboardType="numeric"
            placeholderTextColor="#bbb"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Rating: {rating}/5 ⭐</Text>
          <View style={styles.ratingButtons}>
            {/* <StarRating rating={rating} onChange={setRating}/> */}
            {[1, 2, 3, 4, 5].map(num => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.ratingButton,
                  rating === num && styles.ratingButtonActive,
                ]}
                onPress={() => setRating(num)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Review</Text>
          <TextInput
            style={[styles.input, styles.reviewInput]}
            placeholder="Write your review..."
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={4}
            placeholderTextColor="#bbb"
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleAddEntry}>
          <Text style={styles.submitButtonText}>Add to Diary</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  reviewInput: {
    height: 100,
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  ratingButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  ratingStar: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFA500',
  },
  ratingButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
