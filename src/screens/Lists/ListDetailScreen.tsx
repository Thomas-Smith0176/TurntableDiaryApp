import { getListEntries, ListEntry } from "@/services/ListService";
import { useCallback, useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, Platform, UIManager, View } from "react-native";
import * as ListService from '../../services/ListService';
import { useFocusEffect } from "@react-navigation/native";
import { SpotifyAlbum } from "@/types/spotifyTypes";
import { UIListEntriesSection } from "@/components/Lists/UIListEntriesSection";

interface ListDetailScreenProps {
  route: any;
  navigation: any;
};

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const ListDetailScreen: React.FC<ListDetailScreenProps> = ({ route, navigation }) => {
  const [results, setResults] = useState<SpotifyAlbum[]>([]);
  const [listEntries, setListEntries] = useState<ListEntry[]>([])
  const [initialListEntries, setInitialListEntries] = useState<ListEntry[]>(listEntries);
  const [isEditingList, setIsEditingList] = useState<boolean>(false);
  const { list } = route.params;
  const [listTitle, setListTitle] = useState<string>(list.title);
  const [listDescription, setListDescription] = useState<string>(list.description)

  const initialiseData = useCallback(async () => {
    try {
      const entries = await getListEntries(list.id);
      setListEntries(entries);
    } catch (err) {
      console.error("Failed to load:", err);
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
    console.log("SENDING TO DB:", listEntries.map(e => ({ title: e.albumTitle, hasId: !!e.id, idValue: e.id })));
    ListService.updateList(list.id, {title: listTitle, description: listDescription}, listEntries);
    setIsEditingList(false);
  };

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
              placeholder="Enter list title"
              placeholderTextColor="#b0b0b0"
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
              placeholder="Enter list description (optional)"
              placeholderTextColor="#b0b0b0"
              />
          ) : (
            <Text style={styles.listDescription}>{listDescription}</Text>
          )}
        </View>

        <UIListEntriesSection
        navigation={navigation}
        isEditing={isEditingList}
        listEntries={listEntries}
        setListEntries={setListEntries}
        results={results}
        setResults={setResults}/>

        <View>
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
        </View>
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
    marginTop: 15,
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
    borderRadius: 8,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 14,
    width: '100%',
    marginTop: 15,
  },
  actionsContainer: {
    backgroundColor: '#f9f9f9'
  },
});