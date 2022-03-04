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
import AsyncStorage from '@react-native-async-storage/async-storage';

async function loadPlaylist(key, setPlaylistItems) {
  let playlist = await AsyncStorage.getItem(key);
  playlist = JSON.parse(playlist);
  setPlaylistItems(playlist);
}
async function playAll() {
  let playlist = await AsyncStorage.getItem('likes');
  playlist = JSON.parse(playlist);
  let toAdd = [];

  for (let song of playlist) {
    let response = await fetch(
      `http://www.youtube.com/watch?v=${song.videoId}`,
    );
    let source = await ytdl(youtubeURL, {quality: 'highestaudio'});
    let temp = {
      artwork: song.thumbnail,
      url: source[0].url,
      artist: song.artist,
      title: song.title,
      id: song.videoId,
    };
    toAdd.push(temp);
  }
  await TrackPlayer.reset();
  await TrackPlayer.add(toAdd);
  await TrackPlayer.play();
}
export default function PlaylistScreen({route, navigation}) {
  const {playlistName, playlistKey} = route.params;
  const [playlistItems, setPlaylistItems] = useState([]);
  useEffect(() => {
    loadPlaylist(playlistKey, setPlaylistItems);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.playlistHeader}>
        <Text style={styles.textBold}>{playlistName}</Text>
        <View style={styles.playlistControls}>
          <Icon.Button
            name="play"
            size={30}
            style={{paddingRight: 0}}
            backgroundColor="transparent"
            onPress={() => playAll()}
          />
          <Icon.Button
            name="edit"
            size={30}
            style={{paddingRight: 0}}
            backgroundColor="transparent"
          />
          <Icon.Button
            name="swap"
            size={30}
            style={{paddingRight: 0}}
            backgroundColor="transparent"
          />
        </View>
      </View>
      <ScrollView>
        {playlistItems.map(item => (
          <SearchItem
            title={item.title}
            artist={item.artist}
            videoId={item.videoId}
            thumbnail={item.thumbnail}
            resultType="song"
            key={item.videoId}
          />
        ))}
      </ScrollView>
      <BottomMusicPlayer navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#121212',
    color: 'white',
  },
  playlistHeader: {
    marginTop: 20,
    marginBottom: 20,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },

  playlistControls: {
    flexDirection: 'row',
    marginTop: 10,
  },

  textBold: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 50,
    fontFamily: 'Product Sans Regular',
  },
  text: {
    color: 'white',
    margin: 30,
    fontSize: 15,
    fontFamily: 'Product Sans Regular',
  },
});
