import { fetchLastFmUsername, saveLastFmUsername } from "@/services/ProfileService";
import { useEffect, useState } from "react";
import { Alert, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface LastfmModalProps {
  setShowModal: (value: boolean) => void;
}

export const LastfmModal: React.FC<LastfmModalProps> = ({setShowModal}) => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
      const loadData = async () => {
        const savedName = await fetchLastFmUsername();
        if (savedName) setUsername(savedName);
        setLoading(false);
      };
      loadData();
    }, []);

    const handleSave = async () => {
        if (!username.trim()) {
            Alert.alert('Error', 'Please enter a username');
            return;
        }

        setIsSaving(true);
        const { success, error } = await saveLastFmUsername(username.trim());
        setIsSaving(false);

        if (success) {
        Alert.alert('Success', 'Last.fm account linked!');
        } else {
        Alert.alert('Error', error?.message || 'Failed to save');
        }
    };

    const buttonText = isSaving ? 'Saving...' : 'Save Settings';

    return (
        <Modal visible={true}>
            <View style={styles.container}>
                <TouchableOpacity 
                  style={styles.doneButton} 
                  onPress={() => {setShowModal(false);}}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Image source={require('../../icons/cross-icon.png')} width={20} height={20} style={styles.icon} />
                </TouchableOpacity>
                
                <View style={styles.contentContainer}>
                  <Text style={styles.label}>Link Last.fm Account</Text>
                  <Text style={styles.subLabel}>This allows us to show your recent listening history.</Text>
                  
                  <TextInput
                      style={styles.input}
                      value={username}
                      onChangeText={setUsername}
                      placeholder="Enter Last.fm username"
                      autoCapitalize="none"
                      autoCorrect={false}
                  />
                  
                  <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleSave} 
                    disabled={isSaving}
                  >
                      <Text style={styles.buttonText}>{buttonText}</Text>
                  </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff', 
        justifyContent: 'center',
        paddingTop: 60,
    },
    contentContainer: {
        width: '100%',
    },
    doneButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
    },
    doneButtonText: {
        fontSize: 16,
        color: '#0047FF',
        fontWeight: '600',
    },
    label: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginBottom: 8 
    },
    subLabel: { 
        fontSize: 14, 
        color: '#666', 
        marginBottom: 20 
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#D31F27',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#D31F27',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 16 
    },
    icon: {
        height: 20,
        width: 20,
        opacity: 0.4,
    },
});
