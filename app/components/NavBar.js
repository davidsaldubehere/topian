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

export default function NavBar({navigation}) {
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
          <Text style={styles.navText}>Search</Text>
        </View>

        <View style={styles.navItem}>
          <Icon.Button
            name="home"
            style={{paddingRight: 0}}
            backgroundColor="transparent"
            size={25}
            onPress={() => navigation.navigate('Home')}
          />
          <Text style={styles.navText}>Home</Text>
        </View>
        <View style={styles.navItem}>
          <Icon.Button
            name="heart"
            style={{paddingRight: 0}}
            backgroundColor="transparent"
            size={25}
          />
          <Text style={styles.navText}>Likes</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    alignItems: 'center',
    width: '100%',
    borderBottomColor: 'blue',
    borderBottomWidth: 3,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    backgroundColor: '#272727',
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
  navText: {
    color: 'white',
    fontFamily: 'Product Sans Regular',
  },
});
