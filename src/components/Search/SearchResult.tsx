import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SpotifyAlbum } from '../../types/spotifyTypes';

interface SearchResultProps {
  item: SpotifyAlbum;
  navigation: any;
};

export const SearchResult: React.FC<SearchResultProps> = ({ item, navigation }) => {

  const handleSelectResult = (album: SpotifyAlbum) => {
    navigation.navigate('AddEntry', { selectedAlbum: album });
  }

    return (
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
  albumName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  artistName: {
    color: 'gray',
    fontSize: 14,
  },
});