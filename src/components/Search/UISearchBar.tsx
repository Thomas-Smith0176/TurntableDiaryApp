import { searchAlbums } from "@/services/SpotifyService";
import { SpotifyAlbum } from "@/types/spotifyTypes";
import { useState } from "react";
import { ActivityIndicator, Image, Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"

         
         
interface UISearchBarProps {
    setResults: React.Dispatch<React.SetStateAction<SpotifyAlbum[]>>;
}
         

export const UISearchBar: React.FC<UISearchBarProps> = (props) => {  
    const [loading, setLoading] = useState<boolean>(false);
    const [query, setQuery] = useState<string>('');

    const handleSearch = async () => {
        Keyboard.dismiss();
        if (query.length > 0) {
            setLoading(true);
            try {
                const albums = await searchAlbums(query);
                props.setResults(albums);
            } catch (error) {
                console.error('Error searching albums:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <View style={styles.container}>
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
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
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
    icon: {
        width: 20,
        height: 20,
        opacity: 0.4,
    },
})