import React, {useState} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, ListRenderItem, ActivityIndicator, Keyboard } from 'react-native';
import { useDiary } from '../../context/DiaryContext';
import { AlbumCard } from '../Cards/AlbumCard';
import { Album, DiaryEntry } from '../../types';
import { SpotifyAlbum } from '../../types/spotifyTypes';
import { searchAlbums } from '../../services/SpotifyService';

export const SearchBar = (query: string, setQuery: (text: string) => void, handleSearch: (text: string) => void, results: any[]) => {
const [query  , setQuery] = useState<string>('');
  const [results, setResults] = useState<SpotifyAlbum[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

    const renderAlbumItem: ListRenderItem<SpotifyAlbum> = ({ item }) => (
        <TouchableOpacity onPress={() => console.log('Selected:', item.name)}>
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
};