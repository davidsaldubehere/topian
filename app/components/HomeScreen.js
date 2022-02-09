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

export default function HomeScreen({navigation}) {
  const playbackState = usePlaybackState();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.nav}>
        <View style={styles.navList}>
          <View style={styles.navItem}>
            <Icon.Button
              style={{paddingRight: 0}}
              name="search1"
              backgroundColor="black"
              size={25}
              onPress={() => navigation.navigate('Search')}
            />
            <Text style={styles.navText}>Search</Text>
          </View>

          <View style={styles.navItem}>
            <Icon.Button
              name="home"
              style={{paddingRight: 0}}
              backgroundColor="black"
              size={25}
            />
            <Text style={styles.navText}>Home</Text>
          </View>
          <View style={styles.navItem}>
            <Icon.Button
              name="heart"
              style={{paddingRight: 0}}
              backgroundColor="black"
              size={25}
            />
            <Text style={styles.navText}>Likes</Text>
          </View>
        </View>
      </View>
      <ScrollView styles={styles.scrollView}>
        <Text style={styles.textBold}>Playlists</Text>
        <Text style={styles.textBold}>Recommendations</Text>
        <Text style={styles.textBold}>Stuff</Text>
      </ScrollView>
      <BottomMusicPlayer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-end',
    color: 'white',
  },
  text: {
    color: 'white',
    margin: 30,
    fontWeight: 'bold',
    fontSize: 17,
    maxWidth: '40%',
  },
  textBold: {
    color: 'white',
    margin: 30,
    marginBottom: 200,
    textAlign: 'left',
    fontSize: 35,
    maxWidth: '90%',
    borderBottomWidth: 3,
    borderColor: 'white',
  },
  nav: {
    alignItems: 'center',
    width: '100%',
    borderBottomColor: 'white',
    borderBottomWidth: 3,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
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
  },

  top: {
    position: 'absolute',
    top: 0,
    width: '100%',
    alignItems: 'center',
  },
  scrollView: {
    height: '50%',
    width: '100%',
  },
  musicControls: {
    width: '100%',
    position: 'relative',
    backgroundColor: 'black',
    borderTopColor: 'blue',
    borderTopWidth: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});