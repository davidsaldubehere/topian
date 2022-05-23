import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
  RepeatMode,
  Event,
  Capability,
} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/AntDesign';
import iconButton from 'react-native-vector-icons/dist/lib/icon-button';
import SearchItem from './SearchItem';
import SearchList from './SearchList';
import BottomMusicPlayer from './BottomMusicPlayer';
import AsyncStorage from '@react-native-async-storage/async-storage';
async function checkLikesExist(navigation) {
  let keys = AsyncStorage.getAllKeys();
  if ((await keys).includes('likes')) {
    navigation.navigate('Playlist', {
      playlistName: 'Likes',
      playlistKey: 'likes',
    });
  }
}
export default function NavBar({navigation}) {
  const route = useRoute();

  return (
    <View style={styles.nav}>
      <View style={styles.navList}>
        <View style={styles.navItem}>
          <Icon.Button
            style={{paddingRight: 0}}
            name="search1"
            backgroundColor="transparent"
            size={25}
            onPress={() => navigation.navigate('Search')}
          />
          <Text style={{color: route.name == 'Search' ? 'white' : 'grey'}}>
            Search
          </Text>
        </View>

        <View style={styles.navItem}>
          <Icon.Button
            name="home"
            style={{paddingRight: 0}}
            backgroundColor="transparent"
            size={25}
            onPress={() => navigation.navigate('Home')}
          />
          <Text style={{color: route.name == 'Home' ? 'white' : 'grey'}}>
            Home
          </Text>
        </View>
        <View style={styles.navItem}>
          <Icon.Button
            name="hearto"
            style={{paddingRight: 0}}
            backgroundColor="transparent"
            size={25}
            onPress={() => checkLikesExist(navigation)}
          />
          <Text style={{color: 'grey'}}>Likes</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    alignItems: 'center',
    width: '100%',
    borderBottomColor: '#047AFF',
    borderBottomWidth: 0,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    backgroundColor: '#272727',
    fontFamily: 'Product Sans Regular',
  },
  navList: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navItem: {
    margin: 10,
    alignItems: 'center',
  },
});
