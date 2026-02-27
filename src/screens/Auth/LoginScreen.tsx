import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator} from 'react-native';
import React, { useState } from 'react';
import { supabase } from '../../../supabase/supabaseClient';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignIn = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        });

        if (error) {
        Alert.alert('Login Failed', error.message);
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <TextInput 
                placeholder="Email" 
                style={styles.input} 
                value={email} 
                onChangeText={setEmail} 
            />
            <TextInput 
                placeholder="Password" 
                secureTextEntry 
                style={styles.input} 
                value={password} 
                onChangeText={setPassword} 
            />

            {loading ? (
                <ActivityIndicator size="large" color="#000"/>
            ) : (
                <>
                    <TouchableOpacity onPress={handleSignIn} style={styles.button} disabled={loading}>
                        <Text style={{ color: '#000000', fontSize: 16}}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.button} disabled={loading}>
                        <Text style={{ color: '#000000', fontSize: 16}}>Sign Up</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    borderColor: '#e0e0e0',
    fontSize: 14,
  },
  button: {
    margin: 12,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
});