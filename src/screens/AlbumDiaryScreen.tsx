import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useDiary } from '../context/DiaryContext';
import { AlbumCard } from '../components/Cards/AlbumCard';
import { DiaryEntry } from '../types';
import { useFocusEffect } from '@react-navigation/native';

interface AlbumDiaryScreenProps {
  navigation: any;
};

export const AlbumDiaryScreen: React.FC<AlbumDiaryScreenProps> = ({ navigation }) => {
  const { loadEntries, getAllEntries } = useDiary();

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const handleViewEntry = (entry: DiaryEntry) => {
    navigation.navigate('AlbumDetail', { entryId: entry.id });
  };

  return (
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Music Diary</Text>
            </View>
            {getAllEntries().length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No albums logged yet</Text>
                <Text style={styles.emptySubtext}>Start by adding your first album!</Text>
              </View>
            ) : (
              <FlatList
                data={getAllEntries()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <AlbumCard
                    entry={item}
                    onPress={() => handleViewEntry(item)}
                  />
                )}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
        )}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
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
});