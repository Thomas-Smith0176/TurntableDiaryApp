import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert} from 'react-native';
import { useDiary } from '../context/DiaryContext';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { Album } from '@/types';
import { LastfmModal } from '@/components/Modals/LastfmModal';

export const ProfileScreen: React.FC = () => {
  const { entries, albums, averageRating, loadAlbums, getTopRatedAlbumsFromDiary } = useDiary();
  const [topRatedAlbums, setTopRatedAlbums] = useState<Album[]>([]);
  const [showModal, setShowModal] = useState(false);

  const { signOut, user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      loadAlbums();
      loadTopRatedAlbums();
    }, [])
  );

  const loadTopRatedAlbums = async () => {
    const albums = await getTopRatedAlbumsFromDiary();
    setTopRatedAlbums(albums.slice(0, 5));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{user ? `${user.user_metadata.display_name.slice(0,1).toUpperCase() + user.user_metadata.display_name.slice(1)}'s` : 'My'} Profile</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity style={[styles.button, {backgroundColor: '#e9e9e9'}]} onPress={() => setShowModal(true)}>
            <Image source={require('../icons/link-icon.png')} width={20} height={20} style={[styles.icon]} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: '#e9e9e9'}]} onPress={handleSignOut}>
            <Image source={require('../icons/sign-out-icon.png')} width={20} height={20} style={[styles.icon]} />
        </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{entries.length}</Text>
          <Text style={styles.statLabel}>Records Logged</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{averageRating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Average Rating</Text>
        </View>
      </View>

      {topRatedAlbums.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Rated Records</Text>
          {topRatedAlbums.map(album => (
            <View key={album.id} style={styles.albumItem}>
              <View>
                <Text style={styles.albumTitle}>{album.title}</Text>
                <Text style={styles.albumArtist}>{album.artist}</Text>
              </View>
              <Text style={styles.rating}>{album.latestRating.toFixed(1)}</Text>
            </View>
          ))}
        </View>
      )}
      {showModal && (
        <LastfmModal setShowModal={setShowModal}/> 
      )}
    </ScrollView>
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
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bebebe'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bebebe'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  albumItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  albumTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  albumArtist: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  rating: {
    fontSize: 14,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },  
  icon: {
    height: 20,
    width: 20,
    opacity: 0.4,
  },
});
