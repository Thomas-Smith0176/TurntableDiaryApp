import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Linking, Image} from 'react-native';
import { CrossfaderSlider } from '../components/Sliders/CrossfaderSlider';
import { useDiary } from '../context/DiaryContext';
import * as AlbumService from '../services/AlbumService';

interface AddEntryScreenProps {
  route: any;
  navigation: any;
}

export const AddEntryScreen: React.FC<AddEntryScreenProps> = ({ route, navigation }) => {
  const { selectedAlbum } = route.params;
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);
  const { addEntry } = useDiary();

  const handleAddEntry = async () => {
    setSaving(true);
    const entryPayload = {
      spotifyId: selectedAlbum.id,
      title: selectedAlbum.name,
      artist: selectedAlbum.artist,
      releaseDate: selectedAlbum.releaseDate,
      artworkUrl: selectedAlbum.artwork || '',
      rating: rating,
      review: review,
      dateListened: new Date().toISOString().split('T')[0],
    };

    await addEntry(entryPayload);
    await AlbumService.updateAlbumEntry(selectedAlbum.id, { latest_rating: rating });

    setSaving(false);

    Alert.alert('Success', 'Album added to your diary!');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>{selectedAlbum?.name}</Text>
        </View>
        <Image source={{ uri: selectedAlbum?.artwork }} style={[styles.artwork]} />
        <View style={styles.section}>
          <Text style={styles.details}>{selectedAlbum?.artist} - {selectedAlbum?.releaseDate || 'Release Date'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Rating</Text>
          <CrossfaderSlider
            value={rating}
            onValueChange={setRating}
            min={1}
            max={10}
          />
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
          <Text style={styles.buttonText}>Add to Diary</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Linking.openURL(selectedAlbum?.url)}>
          <View style={styles.listenButton}>
            <Text style={styles.buttonText}>Listen here</Text>
          </View>
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
  page: {
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
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    margin: 8,
    fontFamily: 'Gothic',
  },
  details: {
    fontSize: 24,
    fontWeight: '600',
    margin: 8,
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
  artwork: {
    width: '100%',
    height: 350,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 24,
  },
  listenButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
