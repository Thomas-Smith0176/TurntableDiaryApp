import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { AlbumDiaryScreen } from '../screens/AlbumDiaryScreen';
import { AddEntryScreen } from '../screens/AddEntryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AlbumDetailScreen } from '../screens/AlbumDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AlbumDiary"
        component={AlbumDiaryScreen}
        options={{ title: 'Album Diary' }}
      />
      <Stack.Screen
        name="AddEntry"
        component={AddEntryScreen}
        options={{ title: 'Add Album' }}
      />
      <Stack.Screen
        name="AlbumDetail"
        component={AlbumDetailScreen}
        options={{ title: 'Album Details' }}
      />
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#999',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarLabel: 'Diary',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📔</Text>,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

import { Text } from 'react-native';
