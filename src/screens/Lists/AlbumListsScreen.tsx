import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { List } from '@/types';
import { useListsContext } from '@/context/hooks/useListsContext';

interface AlbumListsScreenProps {
  route: any;
  navigation: any;
}

export const AlbumListsScreen: React.FC<AlbumListsScreenProps> = ({ route, navigation }) => {
  const [query, setQuery] = useState('');
  const lists = useListsContext(query)

  const handleCreateList = () => {
    navigation.navigate('CreateList');
  };

  const renderListItem = ({ item }: { item: List }) => (
    <TouchableOpacity
      style={styles.listCard}
      onPress={() => navigation.navigate('ListDetail', { list: item })}
    >
      <View style={styles.listCardContent}>
        <Text style={styles.listTitle}>{item.title}</Text>
        <Text style={styles.listDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Lists</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateList}>
          <Image source={require('../../icons/add-icon.png')} width={30} height={30} style={[styles.icon]} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
          <TextInput
              placeholder="Search your lists..."
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
              placeholderTextColor="#b0b0b0"
          />
      </View>

      {lists.length === 0 ? (
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
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#e9e9e9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
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
    borderColor: '#e9e9e9',
    borderWidth: 1
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
  icon: {
      width: 20,
      height: 20,
      opacity: 0.4,
  },
  searchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 15,
      paddingVertical: 5
  }, 
  searchInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 8,
  },
});