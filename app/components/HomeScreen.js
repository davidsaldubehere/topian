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
import NavBar from './NavBar';
import Playlists from './Playlists';
export default function HomeScreen({navigation}) {
  const playbackState = usePlaybackState();
  return (
    <SafeAreaView style={styles.container}>
      <NavBar navigation={navigation} />
      <ScrollView styles={styles.scrollView}>
        <View style={styles.innerContainer}>
          <Text style={styles.textBold}>Playlists</Text>
          <Playlists />
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.textBold}>Recommendations</Text>
          <Playlists />
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.textBold}>Stuff</Text>
          <Playlists />
        </View>
      </ScrollView>
      <BottomMusicPlayer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'flex-end',
    color: 'white',
  },
  innerContainer: {
    marginLeft: 20,
  },
  text: {
    color: 'white',
    marginTop: 30,
    fontWeight: 'bold',
    fontSize: 17,
    maxWidth: '40%',
    fontFamily: 'Product Sans Regular',
  },
  textBold: {
    fontFamily: 'Product Sans Regular',
    color: 'white',
    marginBottom: 30,
    marginTop: 30,

    //marginBottom: 200,
    textAlign: 'left',
    fontSize: 35,
    maxWidth: '90%',
    //borderBottomWidth: 3,
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
