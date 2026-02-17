import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable, Alert, TextInput, Image, Modal } from 'react-native';
import { useDiary } from '../context/DiaryContext';
import { CrossfaderSlider } from '../components/Sliders/CrossfaderSlider';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
import * as AlbumService from '../services/AlbumService';
import Slider, { MarkerProps } from '@react-native-community/slider';
import { getAverageColor } from '../components/Buttons/ButtonColour';

interface AlbumDetailScreenProps {
  route: any;
  navigation: any;
};

export const AlbumDetailScreen: React.FC<AlbumDetailScreenProps> = ({ route, navigation }) => {
  const { entryId } = route.params;
  const { getEntryById, updateEntry, deleteEntry } = useDiary();
  const entry = getEntryById(entryId);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [review, setReview] = useState(entry?.review || '');
  const [rating, setRating] = useState(entry?.rating || 5);
  const [dateListen, setDateListen] = useState(entry?.dateListen || '');
  const [accentColor, setAccentColor] = useState('#ffffff');
  const defaultStyles = useDefaultStyles();

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text>Album not found</Text>
      </View>
    );
  }

  const handleUpdate = () => {
    updateEntry(entryId, { review, rating, dateListen});
    AlbumService.updateAlbumEntry(entry.album.id, { latest_rating: rating });
    setIsEditingReview(false);
    Alert.alert('Album details updated!');
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

  useEffect(() => {
    const updateTheme = async () => {
      const color = await getAverageColor(entry.album.artwork);
      setAccentColor(color);
    };

    updateTheme();
  }, [entry.album.artwork]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
          {entry.album?.artwork && <Image source={{ uri: entry.album.artwork }} style={styles.artwork} />}
          <Text style={styles.albumTitle}>{entry.album.title}</Text>
          <Text style={styles.albumDetails}>{entry.album.artist}</Text>
          <Text style={styles.albumDetails}>{entry.album.releaseDate.slice(8, 10)}/{entry.album.releaseDate.slice(5, 7)}/{entry.album.releaseDate.slice(0, 4)}</Text>        
      </View>

      <View style={styles.section}>
        <View style={styles.ratingContainer}>
          <View style={styles.ratingDisplay}>
            <Text style={{fontSize: 24}}>{rating}</Text>
          </View>
          {!isEditingReview && (
          <TouchableOpacity onPress={() => setIsEditingReview(true)}>
            <Image source={require('../icons/edit-icon.png')} width={20} height={20} style={[styles.editIcon]} />
          </TouchableOpacity>
          )}
        </View>

        <View style={styles.reviewContainer}>
        {isEditingReview ? (
          <>
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
          </>
        ) : (
          <>
            <Text style={styles.reviewText}>{review || 'No review added'}</Text>
          </>
        )}
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.value}>Listened on: {new Date(dateListen).toLocaleDateString()}</Text>
          {(!isEditingDate && isEditingReview) && (
            <TouchableOpacity
              onPress={() => setIsEditingDate(true)}
            >
              <Image source={require('../icons/edit-icon.png')} width={20} height={20} style={[styles.editIcon]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isEditingReview && (
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleUpdate}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => {
            setIsEditingReview(false);
            setReview(entry.review);
            setRating(entry.rating);
            setDateListen(entry.dateListen);
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      )}

      <Modal
        visible={isEditingDate}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => {setIsEditingDate(false);}}>
                <Text style={styles.modalCloseButton}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              mode="single"
              date={dateListen}
              onChange={({ date }) => setDateListen(date?.toString() || '')}
              styles={defaultStyles}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Remove from My Diary</Text>
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
  artwork: {
    width: '100%',
    height: 350,
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
    width: '100%',
    marginTop: 15,
    marginBottom: 15,
  },
  slider: {
    width: '100%', 
    height: 40, 
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#e0e0e0',
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
  editIcon: {
    width: 20,
    height: 20,
    opacity: 0.4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    fontSize: 16,
    color: '#0047FF',
    fontWeight: '600',
  },
  inner: {
    position: 'absolute',
    width: 3,
    height: 40,
    backgroundColor: '#999',
    top: '150%',
    marginTop: -8,
  },
});
