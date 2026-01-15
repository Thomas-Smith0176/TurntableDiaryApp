import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useDiary } from '../context/DiaryContext';
import { AlbumCard } from '../components/Cards/AlbumCard';
import { DiaryEntry } from '../types';

interface AlbumDiaryScreenProps {
  route: any;
  navigation: any;
};

export const AlbumDiaryScreen: React.FC<AlbumDiaryScreenProps> = ({ route, navigation }) => {
  const { entries } = useDiary();

  const handleAddEntry = () => {
    navigation.navigate('AddEntry');
  };

  const handleViewEntry = (entry: DiaryEntry) => {
    navigation.navigate('AlbumDetail', { entryId: entry.id });
  };

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
            <Text style={styles.addButtonText}>Log New Record</Text>
          </TouchableOpacity>
        </View>

        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No albums logged yet</Text>
            <Text style={styles.emptySubtext}>Start by adding your first album!</Text>
          </View>
        ) : (
          <FlatList
            data={entries}
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
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