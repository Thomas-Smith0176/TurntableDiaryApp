import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Image} from 'react-native';
import * as ListService from '../../services/ListService';
import { SpotifyAlbum } from '@/types/spotifyTypes';
import { ListEntry } from '@/services/ListService';
import { UIListEntriesSection } from '@/components/Lists/UIListEntriesSection';

interface CreateListScreenProps {
  navigation: any;
}

export const CreateListScreen: React.FC<CreateListScreenProps> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [listEntries, setListEntries] = useState<Partial<ListEntry>[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SpotifyAlbum[]>([]);

  const handleSaveList = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a list title');
      return;
    }

    if (listEntries.length === 0) {
      Alert.alert('Error', 'Please add at least one album to the list');
      return;
    }

    setLoading(true);
    const result = await ListService.createList(title, description, listEntries);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'List created successfully');
      navigation.navigate('AlbumLists');
    } else {
      Alert.alert('Error', result.error || 'Failed to create list');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create New List</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.section}>
          <TextInput
            style={styles.input}
            placeholder="Enter list title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#b0b0b0"
          />
        </View>

        <View style={styles.section}>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Enter list description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            placeholderTextColor="#b0b0b0"
          />
        </View>

        <UIListEntriesSection
          navigation={navigation}
          isEditing={true}
          listEntries={listEntries}
          results={results}
          setListEntries={setListEntries}
          setResults={setResults}
        />

      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSaveList}
          disabled={loading}
        >
          <Image source={require('../../icons/save-icon.png')} width={30} height={30} style={[styles.icon]} />
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
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: { 
    padding: 15
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#676767',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  footer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 12,
  },
  button: { 
    backgroundColor: '#c5e9fd',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 15
  },
  saveButton: { 
    backgroundColor: '#93e6c4',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  icon: {
    width: 20,
    height: 20,
    opacity: 0.4,
  }
});
