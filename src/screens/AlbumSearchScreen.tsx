import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, ListRenderItem, ActivityIndicator, Keyboard } from 'react-native';
import { searchAlbums } from '../services/SpotifyService';
import { SpotifyAlbum } from '../types/spotifyTypes';
import { useFocusEffect } from '@react-navigation/native';
import { SearchResult } from '@/components/Search/SearchResult';
import { LastfmModal } from '@/components/Modals/LastfmModal';
import { fetchLastFmUsername } from '@/services/ProfileService';
import { getRecentAlbums } from '@/services/LastFmService';
import { RecentAlbum } from '@/types/lastFmTypes';
import { SuggestedAlbumCard } from '@/components/Cards/SuggestedAlbumCard';

interface AlbumSearchScreenProps {
  route: any;
  navigation: any;
};
export const AlbumSearchScreen: React.FC<AlbumSearchScreenProps> = ({ route, navigation }) => {
  const [query  , setQuery] = useState<string>('');
  const [results, setResults] = useState<SpotifyAlbum[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [savedName, setSavedName] = useState<string | null>(null);
  const [recentAlbums, setRecentAlbums] = useState<RecentAlbum[]>([]);

  const initializeData = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const name = await fetchLastFmUsername();
      setSavedName(name);

      if (name) {
        const albums = await getRecentAlbums(name);
        setRecentAlbums(albums);
      }
    } catch (error) {
      console.error("Initialization error:", error);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setQuery('');
      setResults([]);
      initializeData();
    }, [initializeData])
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

  const handleRecentAlbumSearch = async (albumTitle: string, artist: string) => {
    await searchAlbums(`${albumTitle} ${artist}`).then((albums) => {
      navigation.navigate('AddEntry', { selectedAlbum: albums[0] });
    });
  };

  const renderAlbumItem: ListRenderItem<SpotifyAlbum> = ({ item }) => (
    <SearchResult item={item} navigation={navigation}/>
  );

  return (
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Add Music</Text>
        </View>
        <View style={styles.header}>
          <TextInput
            placeholder="Search for a record..."
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

        {(results.length > 0 || (query.length > 0 && loading)) && (
          <View style={styles.searchResultsContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#c5e9fd" />
              </View>
            ) : results.length > 0 ? (
              <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={renderAlbumItem}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                style={{ flex: 1 }}
                contentContainerStyle={styles.resultsListContent}
              />
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={styles.emptyText}>No albums found</Text>
              </View>
            )}
          </View>
        )}
          
{results.length === 0 && (
  <View style={styles.carouselSection}>
    <View style={styles.carouselContainer}>
      <Text style={styles.sectionTitle}>Recently Played</Text>

      {loadingHistory ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e9e9e9" style={styles.loading} />
        </View>
      ) : (
        <>
          {!savedName && (
            <Text style={styles.emptySubtext}>Link your Last.fm in Profile</Text>
          )}
          
          {savedName && recentAlbums.length === 0 && (
            <Text style={styles.emptySubtext}>No history found for {savedName}</Text>
          )}

          {savedName && recentAlbums.length > 0 && (
            <FlatList
              data={recentAlbums}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item.timestamp || index.toString()}
              snapToInterval={220}
              decelerationRate={"fast"}
              renderItem={({ item }) => (
                <View style={styles.cardWrapper}>
                  <SuggestedAlbumCard
                    recentAlbum={item}
                    onPress={() => handleRecentAlbumSearch(item.albumTitle, item.artist)}
                  />
                </View>
              )}
            />
          )}
        </>
      )}
    </View>
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>What have you been listening to?</Text>
    </View>
  </View>
)}
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
  carouselSection: {
    flex: 1,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    justifyContent: 'center'
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    paddingHorizontal: 40,
    textAlign: 'center',
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
  icon: {
    width: 20,
    height: 20,
    opacity: 0.4,
  },
  button: {
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#D31F27',
    paddingVertical: 12,
    marginHorizontal: 15,
    marginTop: 15,
  },
  carouselContainer: {
    paddingTop: 15,
    height: 315, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
    color: '#333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardWrapper: {
    width: 180,
  },
  loading: {
    marginTop: 20
  }
});