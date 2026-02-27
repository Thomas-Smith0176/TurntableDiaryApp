import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator} from 'react-native';
import React, { useState } from 'react';
import { supabase } from '../../../supabase/supabaseClient';

export const SignUpScreen = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [displayName, setDisplayName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [emailProvided, setEmailProvided] = useState<boolean>(true);
    const [displayNameProvided, setDisplayNameProvided] = useState<boolean>(true);
    const [passwordProvided, setPasswordProvided] = useState<boolean>(true);

    const handleSignUp = async () => {
        setLoading(true);

        setEmailProvided(!!email);
        setDisplayNameProvided(!!displayName);
        setPasswordProvided(!!password);

        const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
            display_name: displayName, 
            },
        },
        });

        if (error) {
        Alert.alert('Registration Failed', error.message);
        } else if (data.session === null) {
        Alert.alert('Success!', 'Please check your inbox for a verification email.');
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
            {!emailProvided && <Text style={{ color: 'red', marginLeft: 12 }}>Email is required</Text>}
            <TextInput 
                placeholder="Display Name" 
                style={styles.input} 
                value={displayName} 
                onChangeText={setDisplayName} 
            />
            {!displayNameProvided && <Text style={{ color: 'red', marginLeft: 12 }}>Display Name is required</Text>}
            <TextInput 
                placeholder="Password" 
                secureTextEntry 
                style={styles.input} 
                value={password} 
                onChangeText={setPassword} 
            />
            {!passwordProvided && <Text style={{ color: 'red', marginLeft: 12 }}>Password is required</Text>}

            {loading ? (
                <ActivityIndicator size="large" color="#000"/>
            ) : (
                <>
                    <TouchableOpacity onPress={handleSignUp} style={styles.button} disabled={loading}>
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