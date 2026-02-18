import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, ListRenderItem, ActivityIndicator, Keyboard } from 'react-native';
import { useDiary } from '../context/DiaryContext';
import { AlbumCard } from '../components/Cards/AlbumCard';
import { Album, DiaryEntry } from '../types';
import { searchAlbums } from '../services/SpotifyService';
import { SpotifyAlbum } from '../types/spotifyTypes';
import { useFocusEffect } from '@react-navigation/native';

interface AlbumSearchScreenProps {
  route: any;
  navigation: any;
};
export const AlbumSearchScreen: React.FC<AlbumSearchScreenProps> = ({ route, navigation }) => {
  const { loadEntries, getAllEntries } = useDiary();
  const [query  , setQuery] = useState<string>('');
  const [results, setResults] = useState<SpotifyAlbum[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
      setShowSearch(false);
      setQuery('');
    }, [])
  );

  const handleSearch = async () => {
    Keyboard.dismiss();

    if (query.length > 0) {
        setLoading(true);
        try {
          const albums = await searchAlbums(query);
          setResults(albums);
        } catch (error) {
          console.error('Error searching albums:', error);
        } finally {
          setLoading(false);
        }
    }
  };

  const handleSelectResult = (album: SpotifyAlbum) => {
    console.log('Selected album:', album);
    // Future: Navigate to add entry screen with selected album details
    navigation.navigate('AddEntry', { selectedAlbum: album });
    setResults([]);
  }

    const renderAlbumItem: ListRenderItem<SpotifyAlbum> = ({ item }) => (
        <TouchableOpacity onPress={() => handleSelectResult(item)}>
        <View style={styles.resultContainer}>
            {item.thumbnail ? (
            <Image 
                source={{ uri: item.thumbnail }} 
                style={styles.thumbnail} 
            />
            ) : (
            <View style={[styles.thumbnail, styles.placeholder]} />
            )}
            <View style={styles.textContainer}>
            <Text style={styles.albumName}>{item.name}</Text>
            <Text style={styles.artistName}>{item.artist}</Text>
            </View>
        </View>
        </TouchableOpacity>
    );

  return (
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Add Album</Text>
        </View>
        <View style={styles.header}>
          <TextInput
            placeholder="Search for an album..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            style={styles.searchInput}
            returnKeyType="search" 
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (<ActivityIndicator size="small" color="#fff" />) : (
              <Image source={require('../icons/search-icon.png')} width={20} height={20} style={[styles.icon]} />
            )}
          </TouchableOpacity>
        </View>

        {results.length > 0 || loading ? (
          <View style={styles.searchResultsContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={renderAlbumItem}
                contentContainerStyle={styles.resultsListContent}
                ListEmptyComponent={
                  results.length === 0 ? (
                    <Text style={styles.emptyText}>No albums found</Text>
                  ) : null
                }
              />
            )}
          </View>
        ) : null}
      </View>
     )

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  }, 
  title: {
    paddingTop: 40,
    fontSize: 24,
    fontWeight: 'bold',
  }, 
  listContent: {
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  searchButton: {
    backgroundColor: '#e9e9e9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchResultsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsListContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  placeholder: {
    backgroundColor: '#e1e1e1',
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    flex: 1,
  },
  albumName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  artistName: {
    color: 'gray',
    fontSize: 14,
  },
  icon: {
    width: 20,
    height: 20,
    opacity: 0.4,
  },
  button: {
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#d9d9d9',
    paddingVertical: 12,
    marginHorizontal: 15,
    marginTop: 15,
  },
});