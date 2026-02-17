import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Linking, Image} from 'react-native';

interface AlbumListsScreenProps {
  route: any;
  navigation: any;
};

export const AlbumListsScreen: React.FC<AlbumListsScreenProps> = ({ route, navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Album Lists Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});