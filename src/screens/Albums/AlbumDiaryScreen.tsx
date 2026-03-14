import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SectionList, TouchableOpacity, Image } from 'react-native';
import { DiaryEntry } from '../../types';
import { useSectionedDiaryContext } from '../../context/hooks/useDiaryContext';
import { UIAlbumDiary } from '@/components/Diary/UIAlbumDiary';
import { Screen } from 'react-native-screens';

interface AlbumDiaryScreenProps {
  navigation: any;
};

export const AlbumDiaryScreen: React.FC<AlbumDiaryScreenProps> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const diarySections = useSectionedDiaryContext(query);

  const handleViewEntry = (entry: DiaryEntry) => {
    navigation.navigate('AlbumDetail', { entryId: entry.id });
  };

  const handleCreateEntry = () => {
    navigation.navigate('Add', {
      screen: "AlbumSearch"
    })
  };

  return (
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Music Diary</Text>
              <TouchableOpacity style={styles.createButton} onPress={handleCreateEntry}>
                <Image source={require('../../icons/add-icon.png')} width={30} height={30} style={[styles.icon]} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                  placeholder="Search diary by album or artist..."
                  value={query}
                  onChangeText={setQuery}
                  style={styles.searchInput}
                  placeholderTextColor="#b0b0b0"
              />
            </View>

            {diarySections.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No albums logged yet</Text>
                <Text style={styles.emptySubtext}>Start by adding your first album!</Text>
              </View>
            ) : (
              <UIAlbumDiary diarySections={diarySections} onPress={handleViewEntry}/>
            )}
          </View>
        )}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  sectionHeader: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginRight: 10,
  },
  sectionSeparator: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 2,
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
  createButton: {
    backgroundColor: '#e9e9e9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  icon: {
      width: 20,
      height: 20,
      opacity: 0.4,
  },
});