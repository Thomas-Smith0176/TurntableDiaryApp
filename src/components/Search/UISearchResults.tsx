import React from 'react';
import { View, Text, StyleSheet, ListRenderItem, FlatList } from 'react-native';
import { UISearchResult } from './UISearchResult';
import { SpotifyAlbum } from '@/types/spotifyTypes';
import { EnumScreenTypes } from '@/types/enums/EnumScreenType';
import { ListEntry } from '@/services/ListService';

interface UISearchResultsProps {
    screen: EnumScreenTypes;
    results: SpotifyAlbum[];
    navigation: any;
    listLength?: number;
    listEntries?: Partial<ListEntry>[];
    setListEntries?: React.Dispatch<React.SetStateAction<Partial<ListEntry>[]>>;
    setResults?: React.Dispatch<React.SetStateAction<SpotifyAlbum[]>>;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
}
      
export const UISearchResults: React.FC<UISearchResultsProps> = (props) => {

  const renderAlbumItem: ListRenderItem<SpotifyAlbum> = ({ item }) => (
    <UISearchResult item={item} {...props}/>
  );

  return (
        <View style={styles.searchResultsContainer}>
          {props.results.length > 0 ? (
            <FlatList
              data={props.results}
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
  )
}

const styles = StyleSheet.create({
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
  emptyText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      justifyContent: 'center'
  },
})