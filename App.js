import {GestureHandlerRootView} from 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import HomeScreen from './app/components/HomeScreen';
import SearchScreen from './app/components/SearchScreen';
import GlobalMusicPlayer from './app/components/GlobalMusicPlayer';
import PlaylistScreen from './app/components/PlaylistScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
const Stack = createStackNavigator();
const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            transparentCard: true,
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
            options={{...TransitionPresets.RevealFromBottomAndroid}}
          />
          <Stack.Screen
            name="Playlist"
            component={PlaylistScreen}
            options={{presentation: 'transparentModal'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
