import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Linking, Image} from 'react-native';
import { useDiary } from '../context/DiaryContext';
import * as AlbumService from '../services/AlbumService';
import Slider from '@react-native-community/slider';
import { useFocusEffect } from '@react-navigation/native';
import { DateModal } from '@/components/Modals/DateModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface AddEntryScreenProps {
  route: any;
  navigation: any;
}

export const AddEntryScreen: React.FC<AddEntryScreenProps> = ({ route, navigation }) => {
  const { selectedAlbum } = route.params;
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [dateListen, setDateListen] = useState(selectedAlbum?.dateListen || new Date().toISOString().split('T')[0]);
  const [isEditingDate, setIsEditingDate] = useState(false);
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
    navigation.navigate('AlbumSearch');
    navigation.navigate('AlbumDiary');
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      enableOnAndroid={true}
      extraHeight={100}
      enableAutomaticScroll={true}
    >
      <View style={styles.header}>
          {selectedAlbum?.artwork && <Image source={{ uri: selectedAlbum.artwork }} style={styles.artwork} />}
          <Text style={styles.albumTitle}>{selectedAlbum?.name}</Text>
          <Text style={styles.albumDetails}>{selectedAlbum?.artist}</Text>
          <View style={styles.playButtonContainer}>
            <Text style={styles.albumDetails}>{selectedAlbum?.releaseDate.slice(8, 10)}/{selectedAlbum?.releaseDate.slice(5, 7)}/{selectedAlbum?.releaseDate.slice(0, 4)}</Text>        
            <TouchableOpacity onPress={() => Linking.openURL(selectedAlbum?.url)}>
              <View>
                <Image source={require('../icons/play-icon.png')} width={20} height={20} style={[styles.icon]} />
              </View>
            </TouchableOpacity>
          </View>
      </View>


      <View style={styles.section}>
        <View style={styles.ratingContainer}>
          <View style={styles.ratingDisplay}>
            <Text style={{fontSize: 24}}>{rating}</Text>
          </View>
        </View>

        <View style={styles.reviewContainer}>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            value={rating}
            step={1}
            minimumTrackTintColor="#151515"
            thumbTintColor="#151515"
            onValueChange={(value) => {
              setRating(value);
            }}
            />
          <TextInput
            style={styles.reviewInput}
            multiline
            numberOfLines={4}
            value={review}
            onChangeText={setReview}
            textAlignVertical="top"
            />
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.value}>Listened on: {new Date(dateListen).toLocaleDateString()}</Text>
          {(!isEditingDate) && (
            <TouchableOpacity
              onPress={() => setIsEditingDate(true)}
            >
              <Image source={require('../icons/calendar-icon.png')} width={20} height={20} style={[styles.icon]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

        <TouchableOpacity style={styles.button} onPress={handleAddEntry}>
          <Image source={require('../icons/save-icon.png')} width={20} height={20} style={[styles.icon]} />
        </TouchableOpacity>

      <DateModal
        isEditingDate={isEditingDate}
        setIsEditingDate={setIsEditingDate}
        dateListen={dateListen}
        setDateListen={setDateListen}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  albumTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    paddingLeft: 15,
  },
  albumDetails: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    marginBottom: 4,
    paddingLeft: 15,
  },
  playButtonContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingRight: 40
  },
  artwork: {
    width: '100%',
    height: 400,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  value: {
    fontSize: 14,
    marginTop: 4,
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
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingDisplay: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: '#101010',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
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
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 14,
    minHeight: 100,
    width: '100%',
    marginTop: 15,
    marginBottom: 15,
  },
  button: {
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#93e6c4',
    paddingVertical: 12,
    marginHorizontal: 15,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%', 
    height: 40, 
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#e0e0e0',
  },
  icon: {
    width: 20,
    height: 20,
    opacity: 0.4,
  },
});
