import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useDiary } from '@/context/DiaryContext';
import * as ListService from '../services/ListService';

interface AlbumListsScreenProps {
  route: any;
  navigation: any;
}

export const AlbumListsScreen: React.FC<AlbumListsScreenProps> = ({ route, navigation }) => {
  const [lists, setLists] = useState<ListService.List[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    setLoading(true);
    const userLists = await ListService.getUserLists();
    setLists(userLists);
    setLoading(false);
  };

  const handleCreateList = () => {
    navigation.navigate('CreateList');
  };

  const handleDeleteList = (listId: string) => {
    Alert.alert('Delete List', 'Are you sure you want to delete this list?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          const result = await ListService.deleteList(listId);
          if (result.success) {
            loadLists();
            Alert.alert('Success', 'List deleted');
          } else {
            Alert.alert('Error', result.error || 'Failed to delete list');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderListItem = ({ item }: { item: ListService.List }) => (
    <TouchableOpacity
      style={styles.listCard}
      onPress={() => navigation.navigate('ListDetail', { listId: item.id })}
    >
      <View style={styles.listCardContent}>
        <Text style={styles.listTitle}>{item.title}</Text>
        <Text style={styles.listDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteList(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Lists</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateList}>
          <Text style={styles.createButtonText}>+ New List</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <Text>Loading lists...</Text>
        </View>
      ) : lists.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No lists yet</Text>
          <Text style={styles.emptySubtext}>Create a list to get started</Text>
        </View>
      ) : (
        <FlatList
          data={lists}
          renderItem={renderListItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

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
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  listCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  listCardContent: {
    flex: 1,
    marginRight: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  listDescription: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});