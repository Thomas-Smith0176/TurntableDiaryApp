import { getListEntries, ListEntry } from "@/services/ListService";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, ListRenderItem, Image, ScrollView, StyleSheet, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager, View } from "react-native";
import * as ListService from '../../services/ListService';
import { useFocusEffect } from "@react-navigation/native";
import { ListEntryCard } from "@/components/Cards/ListEntryCard";

interface ListDetailScreenProps {
  route: any;
  navigation: any;
};

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const ListDetailScreen: React.FC<ListDetailScreenProps> = ({ route, navigation }) => {

  const [listEntries, setListEntries] = useState<ListEntry[]>([])
  const [loading, setLoading] = useState<Boolean>(false);
  const [isEditingList, setIsEditingList] = useState<Boolean>(false)
  const { list } = route.params;

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
      'Delete Album',
      'Are you sure you want to delete this entry?',
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
    await ListService.updateList(list.id, {title: list.title, description: list.description}, listEntries);
    setLoading(false);
    setIsEditingList(false);
  };

  const renderItem: ListRenderItem<ListEntry> = ({item, index}) => {
    return (
      <View>
        <ListEntryCard entry={item} index={index} isEditingList={isEditingList} listEntries={listEntries} setListEntries={setListEntries}/>
      </View>
    )
  }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.listTitle}>{list.title}</Text>
          <Text style={styles.listDescription}>
            {list.description}
          </Text>
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
            onPress={() => setIsEditingList(true)}
          >
            <Image source={require('../../icons/edit-icon.png')} width={30} height={30} style={[styles.icon]} />
          </TouchableOpacity>
        </View>
          ) : (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonHalf, {backgroundColor: '#d9d9d9'}]}
            onPress={() => setIsEditingList(false)}
          >
            <Image source={require('../../icons/cancel-icon.png')} width={30} height={30} style={[styles.icon]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonHalf, {backgroundColor: '#c5e9fd'}]}
            onPress={() => setIsEditingList(true)}
          >
            <Image source={require('../../icons/save-icon.png')} width={30} height={30} style={[styles.icon]} />
          </TouchableOpacity>
        </View>
        )}
        <FlatList
          data={listEntries}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listEntries}
          />
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
});