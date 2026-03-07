import React, { useCallback, useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, FlatList, ListRenderItem, Image,} from 'react-native';
import * as ListService from '../../services/ListService';
import { SpotifyAlbum } from '@/types/spotifyTypes';
import { UISearchBar } from '@/components/Search/UISearchBar';
import { UISearchResults } from '@/components/Search/UISearchResults';
import { EnumScreenTypes } from '@/types/enums/EnumScreenType';
import { UIListEntry } from '@/components/Lists/UIListEntry';
import { ListEntry } from '@/services/ListService';
import { AlbumDiaryScreen } from '../Albums/AlbumDiaryScreen';
import { useDiaryContext } from '@/context/hooks/useDiaryContext';
import { DiaryEntry } from '@/types';
import { UIAlbumDiary } from '@/components/Diary/UIAlbumDiary';
import { UISimplifiedDiary } from '@/components/Diary/UISimplifiedDiary';

interface CreateListScreenProps {
  navigation: any;
}

export const CreateListScreen: React.FC<CreateListScreenProps> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [listEntries, setListEntries] = useState<Partial<ListEntry>[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SpotifyAlbum[]>([]);
  const [query, setQuery] = useState('');
  const [diaryView, setDiaryView] = useState(false);
  const diaryEntries = useDiaryContext(query);

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

  const renderItem: ListRenderItem<Partial<ListEntry>> = ({item, index}) => {
    return (
      <View>
        <UIListEntry entry={item} index={index} isEditingList={true} listEntries={listEntries} setListEntries={setListEntries}/>
      </View>
    )
  }

  const handleSelectResult = (entry: DiaryEntry) => {
    const newListEntry: Partial<ListEntry> = {
      listPosition: (listEntries?.length ?? 0) + 1,
      albumTitle: entry.album.title,
      artist: entry.album.artist,
      artwork: entry.album.artwork
    }
    setListEntries(prev => [...prev, newListEntry]);
    setDiaryView(false);
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
            placeholderTextColor="#b0b0b0"
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
            placeholderTextColor="#b0b0b0"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Music</Text>
          <UISearchBar setResults={setResults}/>
        </View>


        
        <View style={styles.actionsRow}>
          {!diaryView && results.length == 0 ? (
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => {
                setDiaryView(true)
              }}
              disabled={loading}
            >
              <Image source={require('../../icons/add-icon.png')} width={30} height={30} style={[styles.icon]} />
              <Text style={[styles.text, {paddingLeft: 15}]}>Add from diary</Text>
            </TouchableOpacity>
          ) : (
            <>
            <TouchableOpacity 
            style={{flexDirection: 'row'}}
            onPress={() => {
              setDiaryView(false)
              setResults([])}}>
              <Image source={require('../../icons/cancel-icon.png')} width={30} height={30} style={[styles.icon]} />
              <Text style={[styles.text, {paddingLeft: 15}]}>Back to list</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../../icons/filter-icon.png')} width={30} height={30} style={[styles.icon]} />
            </TouchableOpacity>
            </>
            )}
          </View>

        {(results.length > 0 ) ? (
          <UISearchResults
            screen={EnumScreenTypes.List}
            results={results} 
            navigation={navigation}
            listEntries={listEntries}
            setListEntries={setListEntries}
            setResults={setResults}
            />
        ) : (
        <View style={styles.listSection}>
          {diaryView ? (
            <UISimplifiedDiary diaryEntries={diaryEntries} onPress={handleSelectResult}/>
          ) : 
          (
            <FlatList
              data={listEntries}
              renderItem={renderItem}
              keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
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
          <Text style={styles.text}>Save new list</Text>
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
    borderWidth: 1,
    borderColor: '#ccc',
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
  },
  actionsRow: {
    marginHorizontal: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
