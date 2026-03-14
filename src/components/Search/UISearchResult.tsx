import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SpotifyAlbum } from '../../types/spotifyTypes';
import { EnumScreenTypes } from '@/types/enums/EnumScreenType';
import { ListEntry } from '@/services/ListService';

interface UISearchResultProps {
  item: SpotifyAlbum;
  navigation: any;
  screen: EnumScreenTypes;
  listEntries?: Partial<ListEntry>[];
  setResults?: React.Dispatch<React.SetStateAction<SpotifyAlbum[]>>;
  setListEntries?: React.Dispatch<React.SetStateAction<Partial<ListEntry>[]>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

export const UISearchResult: React.FC<UISearchResultProps> = (props) => {;

  const handleSelectResult = (album: SpotifyAlbum) => {
    console.log(props.item);
    if(props.screen == EnumScreenTypes.Album) {
      props.navigation.navigate('AddEntry', { selectedAlbum: album });
    }
    else if(props.screen == EnumScreenTypes.List) {
      if(props.setListEntries && props.setResults) {
        
        const newListEntry: Partial<ListEntry> = {
          listPosition: (props.listEntries?.length ?? 0) + 1,
          albumTitle: props.item.name,
          artist: props.item.artist,
          artwork: props.item.artwork
        }

        props.setListEntries(prev => [...prev, newListEntry]);
        props.setResults([]);
        props.setQuery('');
      }
    }
  }

  return (
      <TouchableOpacity onPress={() => handleSelectResult(props.item)}>
      <View style={styles.resultContainer}>
          {props.item.thumbnail ? (
          <Image 
              source={{ uri: props.item.thumbnail }} 
              style={styles.thumbnail} 
          />
          ) : (
          <View style={[styles.thumbnail, styles.placeholder]} />
          )}
          <View style={styles.textContainer}>
          <Text style={styles.title}>{props.item.name}</Text>
          <Text style={styles.artist}>{props.item.artist}</Text>
          </View>
      </View>
      </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  artist: {
    color: 'gray',
    fontSize: 14,
  },
});