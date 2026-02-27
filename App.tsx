/**
 * Recordbox Diary App
 * A React Native app for documenting and rating albums
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DiaryProvider } from './src/context/DiaryContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AuthProvider } from '@/context/AuthContext';

function App() {
  return (
      <SafeAreaProvider>
        <DiaryProvider>
          <AuthProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <RootNavigator />
          </AuthProvider>      
        </DiaryProvider>
      </SafeAreaProvider>
  );
}

export default App;
