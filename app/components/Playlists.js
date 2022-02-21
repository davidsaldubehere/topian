import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableNativeFeedback,
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

export default function Playlists() {
  return (
    <ScrollView horizontal={true}>
      <Icon.Button
        style={{paddingRight: 0}}
        name="plus"
        backgroundColor="#272727"
        size={100}
      />
      <TouchableNativeFeedback>
        <View style={styles.playlist}>
          <Text style={styles.playlistText}>Likes</Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback>
        <View style={styles.playlist}>
          <Text style={styles.playlistText}>Listen Later</Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback>
        <View style={styles.playlist}>
          <Text style={styles.playlistText}>Playlist 3</Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback>
        <View style={styles.playlist}>
          <Text style={styles.playlistText}>Playlist 4</Text>
        </View>
      </TouchableNativeFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  playlist: {
    backgroundColor: '#272727',
    width: 120,
    height: 120,
    marginLeft: 10,
    borderRadius: 5,
  },
  playlistText: {
    fontFamily: 'Product Sans Regular',

    textAlign: 'center',
    fontSize: 20,
    position: 'relative',
    top: 50,
    color: '#fff',
  },
});
