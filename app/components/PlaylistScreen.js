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
import ytdl from 'react-native-ytdl';
import GlobalMusicPlayer from './GlobalMusicPlayer';
async function loadPlaylist(key, setPlaylistItems) {
  let playlist = await AsyncStorage.getItem(key);
  playlist = JSON.parse(playlist);
  setPlaylistItems(playlist);
}
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
async function playAll(shouldShuffle) {
  let playlist = await AsyncStorage.getItem('likes');
  playlist = JSON.parse(playlist);
  if (shouldShuffle) {
    playlist = shuffle(playlist);
  }
  await TrackPlayer.reset();
  for (let i = 0; i < playlist.length; i++) {
    let youtubeURL = `http://www.youtube.com/watch?v=${playlist[i].videoId}`;
    let source = await ytdl(youtubeURL, {quality: 'highestaudio'});
    let temp = {
      artwork: playlist[i].thumbnail,
      url: source[0].url,
      artist: playlist[i].artist,
      title: playlist[i].title,
      id: playlist[i].videoId,
    };
    console.log('adding from playList', temp);
    await TrackPlayer.add(temp);
    if (i === 0) {
      await TrackPlayer.play();
    }
  }
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
            onPress={() => playAll(false)}
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
            onPress={() => playAll(true)}
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
      <GlobalMusicPlayer navigation={navigation} target={'bottom'} />
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
