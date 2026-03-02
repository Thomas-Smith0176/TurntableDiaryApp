import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, LayoutAnimation } from 'react-native';
import { ListEntry } from '@/services/ListService';

interface UIListEntryProps {
  entry: Partial<ListEntry>;
  index: number;
  isEditingList: Boolean;
  listEntries: Partial<ListEntry>[];
  setListEntries: React.Dispatch<React.SetStateAction<Partial<ListEntry>[]>>;
}

export const UIListEntry: React.FC<UIListEntryProps> = ({ entry, index, isEditingList, listEntries, setListEntries }) => {

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newEntries = [...listEntries];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newEntries.length) return;
        
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        
        setListEntries((prev: Partial<ListEntry>[]) => {
            const newEntries = [...prev];

            const [movedItem] = newEntries.splice(index, 1);
            newEntries.splice(targetIndex, 0, movedItem);

            newEntries[index] = { ...newEntries[index], listPosition: index };
            newEntries[targetIndex] = { ...newEntries[targetIndex], listPosition: targetIndex };

            return newEntries;
        })     
    };

    const removeItem = () => {
        setListEntries(prev => prev.filter((_, i) => i !== index));
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    return (
        <View style={styles.listEntryCard}>
            <Image source={{ uri: entry.artwork }} style={styles.coverImage} />

            <View style={styles.listEntryCardDetails}>
                <Text ellipsizeMode="tail" numberOfLines={2} style={styles.listEntryTitle}>{entry.albumTitle}</Text>
                <Text ellipsizeMode="tail" numberOfLines={1} style={styles.listEntryArtist}>{entry.artist}</Text>
            </View>

            <View style={styles.rightActionsContainer}>
                {!isEditingList ? (
                    <Text style={styles.listEntryPosition}>{index + 1}</Text>
                ) : (
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

                {isEditingList && (
                    <TouchableOpacity onPress={removeItem}>
                         <Image source={require('../../icons/cancel-icon.png')} style={styles.icon} />
                    </TouchableOpacity>
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
        marginHorizontal: 15,
        alignItems: 'center'
    },
    listEntryCardContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    listEntryCardDetails: {
        flex: 1,
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
        width: 80,
        height: 80,
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
    },
    rightActionsContainer: {
            flexDirection: 'row',  // Keep Remove and Reorder side-by-side
            alignItems: 'center',
            height: 80,
        },
});
