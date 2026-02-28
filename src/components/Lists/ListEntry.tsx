import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, LayoutAnimation } from 'react-native';
import { ListEntry } from '@/services/ListService';

interface UIListEntryProps {
  entry: ListEntry;
  index: number;
  isEditingList: Boolean;
  listEntries: ListEntry[];
  setListEntries: React.Dispatch<React.SetStateAction<ListEntry[]>>;
}

export const UIListEntry: React.FC<UIListEntryProps> = ({ entry, index, isEditingList, listEntries, setListEntries }) => {

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newEntries = [...listEntries];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newEntries.length) return;
        
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        
        setListEntries((prev: ListEntry[]) => {
            const newEntries = [...prev];

            const [movedItem] = newEntries.splice(index, 1);
            newEntries.splice(targetIndex, 0, movedItem);

            newEntries[index] = { ...newEntries[index], list_position: index };
            newEntries[targetIndex] = { ...newEntries[targetIndex], list_position: targetIndex };

            return newEntries;
        })
        
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
                {!isEditingList ? (<Text style={styles.listEntryPosition}>{index + 1}</Text>)
                : (
                    <View style={styles.reorderContainer}>
                        <TouchableOpacity 
                        onPress={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        style={[styles.touchTarget, index === 0 && { opacity: 0.3 }]}
                        >
                        <Image source={require('../../icons/chevron-up-icon.png')} style={styles.icon} />
                        </TouchableOpacity>

                        <TouchableOpacity 
                        onPress={() => moveItem(index, 'down')}
                        disabled={index === listEntries.length - 1}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        style={[styles.touchTarget, index === listEntries.length - 1 && { opacity: 0.3 }]}
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
    reorderContainer: {
        height: 100, 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingVertical: 10,
        paddingRight: 10,
    },
    touchTarget: {
        padding: 10, 
    }
});
