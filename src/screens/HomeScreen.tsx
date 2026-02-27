import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HomePageItemCard } from '../components/Cards/HomePageItemCard';
import { useDiary } from '@/context/DiaryContext';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { entries} = useDiary();

  const latestEntries = entries.slice(0, 3);
    
  const handleNavigate = (screenName: string) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jukebox</Text>
      </View>
      <TouchableOpacity style={styles.card} onPress={() => handleNavigate('AlbumDiary')}>
        <View style={styles.imagesContainer}>
          {latestEntries.length >= 3 ? (
            <>
              {latestEntries.map((entry, index) => (
                <Image key={index} source={{ uri: entry.album.artwork }} style={styles.image} />
              ))}
            </>
          ) : (
            latestEntries.map(entry => (
              <Image key={entry.id} source={{ uri: entry.album.artwork }} style={styles.image} />
            ))
          )}
          <LinearGradient
            colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']}
            start={{ x: 0, y: 1.1 }}
            end={{ x: 0, y: -1 }}
            style={styles.gradientOverlay}
          >
          </LinearGradient>
        </View>
        <Text style={styles.title}>Music Diary</Text>
      </TouchableOpacity>
      <HomePageItemCard
        item={{title: "My Lists", description: "Create and manage your lists"}}
        onPress={() => handleNavigate('AlbumLists')}
      />
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
    paddingTop: 50,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },  
  icon: {
    height: 20,
    width: 20,
    opacity: 0.4,
  },
  imagesContainer: {
    flexDirection: 'row',
    height: 150,
    width: '100%',
  },
  image: {
    flex: 1,
    height: '100%',
    width: '33.33%',
  },
  card: {
    marginHorizontal: 16,
    marginTop: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    justifyContent: 'flex-start',
  },
  title: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgb(0, 0, 0)',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  }
});
