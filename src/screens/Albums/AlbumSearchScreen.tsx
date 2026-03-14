import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, ListRenderItem, ActivityIndicator, Keyboard } from 'react-native';
import { getTrendingAlbums, searchAlbums } from '../../services/SpotifyService';
import { SpotifyAlbum } from '../../types/spotifyTypes';
import { useFocusEffect } from '@react-navigation/native';
import { fetchLastFmUsername } from '@/services/ProfileService';
import { getRecentAlbums } from '@/services/LastFmService';
import { SuggestedAlbum } from '@/types/lastFmTypes';
import { SuggestedAlbumCard } from '@/components/Cards/SuggestedAlbumCard';
import { UISearchResults } from '@/components/Search/UISearchResults';
import { EnumScreenTypes } from '@/types/enums/EnumScreenType';
import { UISearchBar } from '@/components/Search/UISearchBar';

interface AlbumSearchScreenProps {
  navigation: any;
};

export const AlbumSearchScreen: React.FC<AlbumSearchScreenProps> = ({ navigation }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SpotifyAlbum[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [loadingPopular, setLoadingPopular] = useState<boolean>(false);
  const [savedName, setSavedName] = useState<string | null>(null);
  const [recentAlbums, setRecentAlbums] = useState<SuggestedAlbum[]>([]);
  const [popularAlbums, setPopularAlbums] = useState<SuggestedAlbum[]>([]);

  const initialiseData = useCallback(async () => {
    setLoadingHistory(true);
    setLoadingPopular(true);

    const [name, trending] = await Promise.all([
      fetchLastFmUsername(),
      getTrendingAlbums()
    ]);

    setSavedName(name);
    setPopularAlbums(trending);
    setLoadingPopular(false);

    if (name) {
      const history = await getRecentAlbums(name);
      setRecentAlbums(history);
    }
    setLoadingHistory(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setResults([]);
      initialiseData();
    }, [initialiseData])
  );

  const handleRecentAlbumSearch = async (albumTitle: string, artist: string) => {
    await searchAlbums(`${albumTitle} ${artist}`).then((albums) => {
      navigation.navigate('AddEntry', { selectedAlbum: albums[0] });
    });
  };

  return (
      <View style={styles.container}>
        <View style={styles.header}>
            <UISearchBar 
              query={query}
              setResults={setResults}
              setQuery={setQuery}/>
        </View>

        {/* Search results */}
        {(results.length > 0 ) && (
          <UISearchResults
            screen={EnumScreenTypes.Album}
            results={results} 
            navigation={navigation}
            setQuery={setQuery}
            />
        )}

        {/* Trending Releases*/}
        {results.length === 0 && (
          <View>
            <View style={[styles.carouselContainer]}>

              {loadingPopular ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#e9e9e9" style={styles.loading} />
                </View>
              ) : (
                <>       
                  <Text style={styles.sectionTitle}>Trending Releases</Text>
                  {popularAlbums.length === 0 && (
                    <Text style={styles.emptySubtext}>Cannot get trending releases</Text>
                  )}

                  {popularAlbums.length > 0 && (
                    <FlatList
                      data={popularAlbums}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item) => item.albumTitle}
                      snapToInterval={220}
                      decelerationRate={"fast"}
                      renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                          <SuggestedAlbumCard
                            suggestedAlbum={item}
                            onPress={() => handleRecentAlbumSearch(item.albumTitle, item.artist)}
                          />
                        </View>
                      )}
                    />
                  )}
                </>
              )}
            </View>
          </View>
        )}
        
        {/* Recently played */}
        {results.length === 0 && (
          <View>
            <View style={[styles.carouselContainer]}>

              {loadingHistory ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#e9e9e9" style={styles.loading} />
                </View>
              ) : (
                <>
                  <Text style={styles.sectionTitle}>Recently Played</Text>
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
                      keyExtractor={(item) => item.id}
                      snapToInterval={220}
                      decelerationRate={"fast"}
                      renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                          <SuggestedAlbumCard
                            suggestedAlbum={item}
                            onPress={() => handleRecentAlbumSearch(item.albumTitle, item.artist)}
                          />
                        </View>
                      )}
                    />
                  )}
                </>
              )}
            </View>
          </View>
        )}
      </View>
     )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 15,
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
  searchBar: {
    paddingHorizontal: 15
  },
  listContent: {
    paddingVertical: 8,
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
    paddingVertical: 40
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
    height: 300,
    paddingTop: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
    color: '#3b3b3b',
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