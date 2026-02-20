import React from 'react';
import { Image, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { AlbumDiaryScreen } from '../screens/AlbumDiaryScreen';
import { AddEntryScreen } from '../screens/AddEntryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AlbumDetailScreen } from '../screens/AlbumDetailScreen';
import { AlbumListsScreen } from '../screens/AlbumListsScreen';
import { CreateListScreen } from '../screens/CreateListScreen';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { AlbumSearchScreen } from '@/screens/AlbumSearchScreen';

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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AlbumLists"
        component={AlbumListsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateList"
        component={CreateListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AlbumDetail"
        component={AlbumDetailScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AlbumSearch"
        component={AlbumSearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddEntry"
        component={AddEntryScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#040404',
            tabBarInactiveTintColor: '#999',
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              tabBarLabel: 'My Music',
              tabBarIcon: ({ focused }) => (
                <Image 
                  source={require('../icons/record-icon.png')} 
                  style={{ width: 25, height: 25, opacity: focused ? 1 : 0.2 }} 
                />
              ),
            }}
          />
          <Tab.Screen
            name="Add"
            component={SearchStack}
            options={{
              tabBarLabel: 'Add to Diary',
              tabBarIcon: ({ focused }) => (
                <Image 
                  source={require('../icons/add-icon.png')} 
                  style={{ width: 20, height: 20, opacity: focused ? 1 : 0.2 }} 
                />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'My Profile',
              tabBarIcon: ({ focused }) => (
                <Image 
                  source={require('../icons/profile-icon.png')} 
                  style={{ width: 30, height: 30, opacity: focused ? 1 : 0.2 }} 
                />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};
