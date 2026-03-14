import { searchAlbums } from "@/services/SpotifyService";
import { SpotifyAlbum } from "@/types/spotifyTypes";
import { useEffect } from "react";
import { ActivityIndicator, Image, Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"

         
         
interface UISearchBarProps {
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    setResults: React.Dispatch<React.SetStateAction<SpotifyAlbum[]>>;
}

export const UISearchBar: React.FC<UISearchBarProps> = (props) => {  

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (props.query.length > 2) {
                handleSearch();
            } else if (props.query.length === 0) {
                props.setResults([]);
            }
        }, 250);
        return () => clearTimeout(delayedSearch);
    }, [props.query]);

    const handleSearch = async () => {
        if (props.query.length > 0) {
            try {
                const albums = await searchAlbums(props.query);
                props.setResults(albums);
            } catch (error) {
                console.error('Error searching albums:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search for a record..."
                value={props.query}
                onChangeText={props.setQuery}
                style={styles.searchInput}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#b0b0b0"
                returnKeyType="search"
                onSubmitEditing={handleSearch}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
    }
})