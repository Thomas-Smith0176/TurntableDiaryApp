import React, { useCallback, useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, FlatList, ListRenderItem, Image,} from 'react-native';
import * as ListService from '../../services/ListService';
import { SpotifyAlbum } from '@/types/spotifyTypes';
import { UISearchBar } from '@/components/Search/UISearchBar';
import { UISearchResults } from '@/components/Search/UISearchResults';
import { EnumScreenTypes } from '@/types/enums/EnumScreenType';
import { UIListEntry } from '@/components/Lists/UIListEntry';
import { ListEntry } from '@/services/ListService';

interface CreateListScreenProps {
  navigation: any;
}

export const CreateListScreen: React.FC<CreateListScreenProps> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [listEntries, setListEntries] = useState<Partial<ListEntry>[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SpotifyAlbum[]>([]);

  // const handleRemoveAlbum = (albumId: string) => {
  //   setListEntries(listEntries.filter(id => id !== albumId));
  // };

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
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error || 'Failed to create list');
    }
  };

  const renderItem: ListRenderItem<Partial<ListEntry>> = ({item, index}) => {
    return (
      <View>
        <UIListEntry entry={item} index={index} isEditingList={true} listEntries={listEntries} setListEntries={setListEntries}/>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create New List</Text>
      </View>

      <View style={styles.container}>
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

        <View style={styles.section}>
            <Text style={styles.label}>Music</Text>
          <UISearchBar setResults={setResults}/>
        </View>

        {(results.length > 0 ) ? (
          <UISearchResults
            screen={EnumScreenTypes.List}
            results={results} 
            navigation={navigation}
            listEntries={listEntries}
            setListEntries={setListEntries}
            setResults={setResults}
            onClear={() => {
              setResults([]);
            }}/>
        ) : (
        <View style={styles.listSection}>
          {listEntries.length === 0 ? (
            <Text style={styles.emptyText}>No records added yet</Text>
          ) : 
          (
            <FlatList
              data={listEntries}
              renderItem={renderItem}
              keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
              contentContainerStyle={styles.listEntries}
            />
          )
          }
        </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSaveList}
          disabled={loading}
        >
          <Image source={require('../../icons/save-icon.png')} width={20} height={20} style={[styles.icon]} />
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
  listSection: { 
    flex: 1,
    paddingVertical: 15
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
  emptyText: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  footer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 12,
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
  listEntries: {
    borderColor: '#cfcfcf',
    borderBottomWidth: 0.5,
  },
  icon: {
    width: 20,
    height: 20,
    opacity: 0.4,
  },
});
