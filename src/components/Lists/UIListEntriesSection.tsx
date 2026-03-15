import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, LayoutAnimation, FlatList, ListRenderItem } from 'react-native';
import { ListEntry } from '@/services/ListService';
import { UISearchBar } from '../Search/UISearchBar';
import { SpotifyAlbum } from '@/types/spotifyTypes';
import { UISearchResults } from '../Search/UISearchResults';
import { EnumScreenTypes } from '@/types/enums/EnumScreenType';
import { UISimplifiedDiary } from '../Diary/UISimplifiedDiary';
import { DiaryEntry } from '@/types';
import { UIListEntry } from './UIListEntry';
import { useDiaryContext } from '@/context/hooks/useDiaryContext';

interface UIListEntriesSectionProps {
    navigation: any;
    isEditing: boolean;
    listEntries: Partial<ListEntry>[];
    results: SpotifyAlbum[];
    setListEntries: React.Dispatch<React.SetStateAction<Partial<ListEntry>[]>>;
    setResults: React.Dispatch<React.SetStateAction<SpotifyAlbum[]>>;
}

export const UIListEntriesSection: React.FC<UIListEntriesSectionProps> = ({ navigation, isEditing, listEntries, results, setListEntries, setResults }) => {
    const [diaryView, setDiaryView] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showNumbering, setShowNumbering] = useState(true);
    const [diaryQuery, setDiaryQuery] = useState('');
    const diaryEntries = useDiaryContext(diaryQuery);

     const renderItem: ListRenderItem<Partial<ListEntry>> = ({item, index}) => {
        return (
          <View>
            <UIListEntry 
                entry={item} 
                index={index} 
                isEditingList={isEditing} 
                listEntries={listEntries}
                showNumbering={showNumbering} 
                setListEntries={setListEntries}
            />
          </View>
        )
      }

    const handleSelectResult = (entry: DiaryEntry) => {
        const newListEntry: Partial<ListEntry> = {
            listPosition: (listEntries?.length ?? 0) + 1,
            albumTitle: entry.album.title,
            artist: entry.album.artist,
            artwork: entry.album.artwork
        }
        setListEntries(prev => [...prev, newListEntry]);
        setDiaryView(false);
    }

    return (
        <>
            {isEditing && (
            <>
            <View style={styles.actionsRow}>
                {!diaryView && results.length == 0 ? (
                <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => {
                    setDiaryView(true)
                    }}
                >
                    <Image source={require('../../icons/add-icon.png')} width={30} height={30} style={[styles.icon]} />
                    <Text style={[styles.text, {paddingLeft: 15}]}>Add from diary</Text>
                </TouchableOpacity>
                ) : (
                <>
                <TouchableOpacity 
                style={{flexDirection: 'row'}}
                onPress={() => {
                    setDiaryView(false)
                    setResults([])
                    setSearchQuery('')}}>
                    <Image source={require('../../icons/cancel-icon.png')} width={30} height={30} style={[styles.icon]} />
                    <Text style={[styles.text, {paddingLeft: 15}]}>Back to list</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    {/* <Image source={require('../../icons/filter-icon.png')} width={30} height={30} style={[styles.icon]} /> */}
                </TouchableOpacity>
                </>
                )}
            </View>
            {!diaryView && (
            <>
            <View style={styles.section}>
                <UISearchBar 
                    setResults={setResults}
                    query={searchQuery}
                    setQuery={setSearchQuery}
                />
            </View>
            <View style={styles.section}>
                <TouchableOpacity 
                style={{flexDirection: 'row'}}
                onPress={() => {setShowNumbering(!showNumbering)}}>
                    {showNumbering ? (<>
                        <Image source={require('../../icons/eye-shut-icon.png')} width={30} height={30} style={[styles.icon]} />
                        <Text style={[styles.text, {paddingLeft: 15}]}>Hide numbers</Text>
                    </>) : (<>
                        <Image source={require('../../icons/eye-icon.png')} width={30} height={30} style={[styles.icon]} />
                        <Text style={[styles.text, {paddingLeft: 15}]}>Show numbers</Text>
                    </>)}
                </TouchableOpacity>
            </View>
            </>)}
            </>)}

            {(results.length > 0 ) ? (
                <UISearchResults
                screen={EnumScreenTypes.List}
                results={results} 
                navigation={navigation}
                listEntries={listEntries}
                setListEntries={setListEntries}
                setResults={setResults}
                setQuery={setSearchQuery}
                />
                ) : (
                <View style={styles.listSection}>
                    {diaryView ? (
                        <UISimplifiedDiary diaryEntries={diaryEntries} onPress={handleSelectResult}/>
                    ) : 
                    (<FlatList
                        data={listEntries}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
                    />)
                    }
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    section: { 
        padding: 15
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    actionsRow: {
        marginHorizontal: 15,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    icon: {
        width: 20,
        height: 20,
        opacity: 0.4,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: '#676767',
    },
    listSection: { 
        flex: 1,
    },
})