/**
 * Recordbox Diary App
 * A React Native app for documenting and rating albums
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DiaryProvider } from './src/context/DiaryContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <DiaryProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <RootNavigator />
      </DiaryProvider>
    </SafeAreaProvider>
  );
}

export default App;
