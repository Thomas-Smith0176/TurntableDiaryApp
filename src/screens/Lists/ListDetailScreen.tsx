import { getListEntries, ListEntry } from "@/services/ListService";
import { useCallback, useEffect, useState } from "react";
import { Alert, ActivityIndicator, FlatList, ListRenderItem, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, LayoutAnimation, Platform, UIManager, View, Keyboard } from "react-native";
import * as ListService from '../../services/ListService';
import { useFocusEffect } from "@react-navigation/native";
import { UIListEntry } from "../../components/Lists/UIListEntry";
import { UISearchResults } from "@/components/Search/UISearchResults";
import { SpotifyAlbum } from "@/types/spotifyTypes";
import { searchAlbums } from "@/services/SpotifyService";
import { EnumScreenTypes } from "@/types/enums/EnumScreenType";

interface ListDetailScreenProps {
  route: any;
  navigation: any;
};

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const ListDetailScreen: React.FC<ListDetailScreenProps> = ({ route, navigation }) => {
  const [query  , setQuery] = useState<string>('');
  const [results, setResults] = useState<SpotifyAlbum[]>([]);
  const [listEntries, setListEntries] = useState<ListEntry[]>([])
  const [initialListEntries, setInitialListEntries] = useState<ListEntry[]>(listEntries);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditingList, setIsEditingList] = useState<Boolean>(false);
  const { list } = route.params;
  const [listTitle, setListTitle] = useState<string>(list.title);
  const [listDescription, setListDescription] = useState<string>(list.description)
  const [newEntries, setNewEntries] = useState<ListEntry[]>([])

  const initialiseData = useCallback(async () => {
    setLoading(true);
    try {
      const entries = await getListEntries(list.id);
      setListEntries(entries);
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  }, [list.id])

  useFocusEffect(
    useCallback(() => {
      initialiseData();
    }, [initialiseData])
  );

  const handleDelete = () => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            ListService.deleteList(list.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleUpdate = async () => {
    setLoading(true);
    ListService.updateList(list.id, {title: listTitle, description: listDescription}, listEntries);
    setLoading(false);
    setIsEditingList(false);
  };

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
          console.log(results);
          setLoading(false);
        }
    }
  };

  const renderItem: ListRenderItem<ListEntry> = ({item, index}) => {
    return (
      <View>
        <UIListEntry entry={item} index={index} isEditingList={isEditingList} listEntries={listEntries} setListEntries={setListEntries}/>
      </View>
    )
  }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {isEditingList ? (
            <TextInput
              numberOfLines={1}
              style={styles.listInput}
              value={listTitle}
              onChangeText={setListTitle}
              textAlignVertical="top"
              />
          ) : (
            <Text style={styles.listTitle}>{listTitle}</Text>
          )}
          {isEditingList ? (
            <TextInput
              style={styles.listInput}
              multiline
              numberOfLines={4}
              value={listDescription}
              onChangeText={setListDescription}
              textAlignVertical="top"
              />
          ) : (
            <Text style={styles.listDescription}>{listDescription}</Text>
          )}
        </View>
        {!isEditingList ? (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonHalf, {backgroundColor: '#d9d9d9'}]}
            onPress={handleDelete}
          >
            <Image source={require('../../icons/delete-icon.png')} width={30} height={30} style={[styles.icon]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonHalf, {backgroundColor: '#c5e9fd'}]}
            onPress={() => {
              setIsEditingList(true)
              setInitialListEntries(listEntries)
          }}
          >
            <Image source={require('../../icons/edit-icon.png')} width={30} height={30} style={[styles.icon]} />
          </TouchableOpacity>
        </View>
          ) : (
        <View style={styles.actionsContainer}>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.button, styles.buttonHalf, {backgroundColor: '#d9d9d9'}]}
              onPress={() => {
                setIsEditingList(false) 
                setListEntries(initialListEntries)
              }}
            >
              <Image source={require('../../icons/cancel-icon.png')} width={30} height={30} style={[styles.icon]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonHalf, {backgroundColor: '#93e6c4'}]}
              onPress={handleUpdate}
            >
              <Image source={require('../../icons/save-icon.png')} width={30} height={30} style={[styles.icon]} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBarContainer}>
            <TextInput
              placeholder="Search for a record..."
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              style={styles.searchInput}
              returnKeyType="search" 
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity 
              style={styles.searchButton} 
              onPress={handleSearch}
              disabled={loading}
            >
              {loading ? (<ActivityIndicator size="small" color="#fff" />) : (
                <Image source={require('../../icons/search-icon.png')} width={20} height={20} style={[styles.icon]} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        )}
        <View style={{ flex: 1 }}>
          {(results.length > 0 || (query.length > 0 && loading)) ? (
            <UISearchResults
              screen={EnumScreenTypes.List}
              results={results} 
              loading={loading} 
              navigation={navigation}
              listLength={listEntries.length}
              setNewListEntries={setNewEntries}
              onClear={() => {
                setResults([]);
                setQuery('');
              }}/>
          ) : (
            <FlatList
              data={listEntries}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listEntries}
            />
          )}
        </View>
      </View>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  listDescription: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    marginBottom: 4,
  },
  listEntries: {
    borderColor: '#cfcfcf',
    borderBottomWidth: 0.5,
  },
  actionsRow: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonHalf: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 0,
  },
  button: {
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#e9e9e9',
    paddingVertical: 12,
  },
  icon: {
    width: 20,
    height: 20,
    opacity: 0.4,
  },
  listInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 14,
    width: '100%',
    marginTop: 15,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  searchButton: {
    backgroundColor: '#e9e9e9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    backgroundColor: '#f9f9f9'
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15
  }
});