import React, {useEffect, useState} from 'react';
import HomeScreen from './app/components/HomeScreen';
import SearchScreen from './app/components/SearchScreen';
import GlobalMusicPlayer from './app/components/GlobalMusicPlayer';
import PlaylistScreen from './app/components/PlaylistScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          options={{presentation: 'transparentModal'}}
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{presentation: 'transparentModal'}}
        />
        <Stack.Screen
          name="Full"
          component={GlobalMusicPlayer}
          options={{presentation: 'transparentModal'}}
        />
        <Stack.Screen
          name="Playlist"
          component={PlaylistScreen}
          options={{presentation: 'transparentModal'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
