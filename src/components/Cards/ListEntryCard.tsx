import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, LayoutAnimation } from 'react-native';
import { ListEntry } from '@/services/ListService';

interface ListEntryCardProps {
  entry: ListEntry;
  index: number;
  isEditingList: Boolean;
  listEntries: ListEntry[];
  setListEntries: React.Dispatch<React.SetStateAction<ListEntry[]>>;
}

export const ListEntryCard: React.FC<ListEntryCardProps> = ({ entry, index, isEditingList, listEntries, setListEntries }) => {

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newEntries = [...listEntries];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newEntries.length) return;

        const temp = newEntries[index];
        newEntries[index] = newEntries[targetIndex];
        newEntries[targetIndex] = temp;

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setListEntries(newEntries);
    };

    return (
        <View style={styles.listEntryCard}>
            <Image
                source={{ uri: entry.album.artwork }}
                style={styles.coverImage}
                />
            <View style={styles.listEntryCardContent}>
                <View style={styles.listEntryCardDetails}>
                    <Text style={styles.listEntryTitle}>{entry.album.title}</Text>
                    <Text style={styles.listEntryArtist}>{entry.album.artist}</Text>
                </View>
                {!isEditingList ? (<Text style={styles.listEntryPosition}>{entry.list_position}</Text>)
                : (
                    <View>
                        <TouchableOpacity 
                        onPress={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        style={index === 0 && { opacity: 0.3 }}
                        >
                        <Image source={require('../../icons/chevron-up-icon.png')} style={styles.icon} />
                        </TouchableOpacity>

                        <TouchableOpacity 
                        onPress={() => moveItem(index, 'down')}
                        disabled={index === listEntries.length - 1}
                        style={index === listEntries.length - 1 && { opacity: 0.3 }}
                        >
                        <Image source={require('../../icons/chevron-down-icon.png')} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    listEntryCard: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 20,
        borderColor: '#cfcfcf',
        borderTopWidth: 1,
        paddingTop: 20,
        marginHorizontal: 15
    },
    listEntryCardContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    listEntryCardDetails: {
        justifyContent: 'center',
        paddingHorizontal: 15
    },
    listEntryTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        paddingVertical: 5
    },
    listEntryArtist: {
        fontSize: 13,
        color: '#666',
    },
    listEntryPosition: {
        fontSize: 15,
        color: '#666',
        paddingRight: 15,
    },
    coverImage: {
        width: 100,
        height: 100,
    },
    icon: {
        width: 20,
        height: 20,
        opacity: 0.4,
    },
});
