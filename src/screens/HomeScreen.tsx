import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { HomePageItemCard } from '../components/Cards/HomePageItemCard';
import { useAuth } from '../context/AuthContext';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { signOut, user } = useAuth();

  const handleNavigate = (screenName: string) => {
    navigation.navigate(screenName);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{user ? `${user.user_metadata.display_name.slice(0,1).toUpperCase() + user.user_metadata.display_name.slice(1)}'s` : 'My'} Jukebox</Text>
        <TouchableOpacity style={[styles.addButton, {backgroundColor: '#e9e9e9'}]} onPress={handleSignOut}>
            <Image source={require('../icons/sign-out-icon.png')} width={20} height={20} style={[styles.icon]} />
        </TouchableOpacity>
      </View>
      <HomePageItemCard
        item={{title: "Album Diary", description: "View and manage your album diary"}}
        onPress={() => handleNavigate('AlbumDiary')}
      />
      <HomePageItemCard
        item={{title: "My Lists", description: "Create and manage your album lists"}}
        onPress={() => handleNavigate('AlbumLists')}
      />
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
    paddingBottom: 20,
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
  icon: {
    height: 20,
    width: 20,
    opacity: 0.4,
  },
});
