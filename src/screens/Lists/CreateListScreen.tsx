import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useDiary } from '@/context/DiaryContext';
import * as ListService from '../../services/ListService';
import { useFocusEffect } from '@react-navigation/native';
import { SpotifyAlbum } from '@/types/spotifyTypes';
import { UISearchBar } from '@/components/Search/UISearchBar';
import { UISearchResults } from '@/components/Search/UISearchResults';
import { EnumScreenTypes } from '@/types/enums/EnumScreenType';

interface CreateListScreenProps {
  navigation: any;
}

export const CreateListScreen: React.FC<CreateListScreenProps> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAlbums, setSelectedAlbums] = useState<SpotifyAlbum[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SpotifyAlbum[]>([]);

  const handleRemoveAlbum = (albumId: string) => {
    setSelectedAlbums(selectedAlbums.filter(id => id !== albumId));
  };

  const handleSaveList = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a list title');
      return;
    }

    if (selectedAlbums.length === 0) {
      Alert.alert('Error', 'Please add at least one album to the list');
      return;
    }

    setLoading(true);
    const result = await ListService.createList(title, description, selectedAlbums);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'List created successfully');
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error || 'Failed to create list');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New List</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>List Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter list title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#ccc"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Enter list description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            placeholderTextColor="#ccc"
          />
        </View>

        <UISearchBar setResults={setResults}/>

        {(results.length > 0 ) ? (
          <UISearchResults
            screen={EnumScreenTypes.List}
            results={results} 
            navigation={navigation}
            selectedAlbums={selectedAlbums}
            setSelectedAlbums={setSelectedAlbums}
            setResults={setResults}
            onClear={() => {
              setResults([]);
            }}/>
        ) : (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Albums in List</Text>
            <Text style={styles.albumCount}>{selectedAlbums.length}</Text>
          </View>

          {selectedAlbums.length === 0 ? (
            <Text style={styles.emptyText}>No albums added yet</Text>
          ) : (
            <View style={styles.selectedAlbumsList}>
              {selectedAlbums.map(album => (
                <View key={album.id} style={styles.selectedAlbumItem}>
                  <View style={styles.selectedAlbumInfo}>
                    <Text style={styles.selectedAlbumTitle} numberOfLines={1}>
                      {album.name}
                    </Text>
                    <Text style={styles.selectedAlbumArtist} numberOfLines={1}>
                      {album.artist}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveAlbum(album.id)}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSaveList}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save List'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8'
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  albumCount: {
    backgroundColor: '#007AFF',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  selectedAlbumsList: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
  },
  selectedAlbumItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedAlbumInfo: {
    flex: 1,
  },
  selectedAlbumTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedAlbumArtist: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    paddingLeft: 12,
    paddingVertical: 4,
  },
  removeButtonText: {
    fontSize: 18,
    color: '#ff3b30',
    fontWeight: 'bold',
  },
  addAlbumButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addAlbumButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 12,
  },
  saveButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  albumList: {
    flex: 1,
  },
  albumOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  albumOptionSelected: {
    backgroundColor: '#f0f8ff',
  },
  albumOptionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  checkmark: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: 'bold',
  },
});
