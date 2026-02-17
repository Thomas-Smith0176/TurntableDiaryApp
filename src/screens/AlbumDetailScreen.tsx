import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable, Alert, TextInput, Image, Modal } from 'react-native';
import { useDiary } from '../context/DiaryContext';
import { CrossfaderSlider } from '../components/Sliders/CrossfaderSlider';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';

interface AlbumDetailScreenProps {
  route: any;
  navigation: any;
};

export const AlbumDetailScreen: React.FC<AlbumDetailScreenProps> = ({ route, navigation }) => {
  const { entryId } = route.params;
  const { getEntryById, updateEntry, deleteEntry } = useDiary();
  const entry = getEntryById(entryId);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [review, setReview] = useState(entry?.review || '');
  const [rating, setRating] = useState(entry?.rating || 5);
  const [dateListen, setDateListen] = useState(entry?.dateListen || '');
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
    setIsEditing(false);
    Alert.alert('Success', 'Album details updated!');
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.albumTitle}>{entry.album.title}</Text>
        {entry.album?.artwork && <Image source={{ uri: entry.album.artwork }} style={styles.artwork} />}
        <Text style={styles.artist}>{entry.album.artist}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.ratingContainer}>
          <CrossfaderSlider
            value={rating}
            onValueChange={(value) => {
              setRating(value);
              setIsEditing(true);
            }}
            min={1}
            max={10}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Review</Text>
          {!isEditing && (
            <TouchableOpacity
            onPress={() => setIsEditing(true)}
            >
              <Image source={require('../icons/edit-icon.png')} width={20} height={20} style={[styles.editIcon]} />
            </TouchableOpacity>
          )}
        </View>
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

      {isEditing && (
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
            setIsEditing(false);
            setReview(entry.review);
            setRating(entry.rating);
            setDateListen(entry.dateListen);
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Listened on:</Text>
          {!isEditingDate && (
            <TouchableOpacity
              onPress={() => setIsEditingDate(true)}
            >
              <Image source={require('../icons/edit-icon.png')} width={20} height={20} style={[styles.editIcon]} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.label}>Listened on:</Text>
        <Text style={styles.value}>
          {new Date(dateListen).toLocaleDateString()}
        </Text>
      </View>

      <Modal
        visible={isEditingDate}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => {setIsEditingDate(false); handleUpdate();}}>
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
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});
