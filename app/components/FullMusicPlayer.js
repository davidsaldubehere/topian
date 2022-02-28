import React, {useEffect, useState, useReducer} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import iconButton from 'react-native-vector-icons/dist/lib/icon-button';
async function toggle() {
  const state = await TrackPlayer.getState();

  if (state === State.Playing) {
    TrackPlayer.pause();
  } else {
    TrackPlayer.play();
  }
}
async function checkLikedState(setIsLiked) {
  let trackIndex = await TrackPlayer.getCurrentTrack();
  let trackObject = await TrackPlayer.getTrack(trackIndex);
  let currentTitle = trackObject.title;
  let currentKeys = await AsyncStorage.getAllKeys();
  if (!currentKeys.includes('likes')) {
    setIsLiked(false);
    console.log('no likes key, so not liked');
  } else {
    let likes = await AsyncStorage.getItem('likes');
    let likesArray = JSON.parse(likes);
    let isLiked = likesArray.map(song => song.title).includes(currentTitle);
    setIsLiked(isLiked);
  }
}
async function addToPlaylist(playlist, isLiked, setIsLiked) {
  let trackIndex = await TrackPlayer.getCurrentTrack();
  let trackObject = await TrackPlayer.getTrack(trackIndex);
  let songObj = {
    title: trackObject.title,
    artist: trackObject.artist,
    videoId: trackObject.id,
    thumbnail: trackObject.artwork,
  };
  let currentKeys = await AsyncStorage.getAllKeys();
  if (!currentKeys.includes(playlist)) {
    await AsyncStorage.setItem(playlist, JSON.stringify([songObj]));
    await setIsLiked(true);
    console.log('created new likes key');
  } else {
    let previousState = await AsyncStorage.getItem(playlist);
    let playlistArray = JSON.parse(previousState);
    console.log(previousState);
    if (playlist === 'likes' && isLiked) {
      console.log('removing liked song');
      await setIsLiked(false);
      playlistArray = playlistArray.filter(
        song => song.title !== songObj.title,
      );
    } else {
      playlistArray.push(songObj);
      if (playlist === 'likes') {
        console.log('adding liked song');
        await setIsLiked(true);
      }
    }
    await AsyncStorage.setItem(playlist, JSON.stringify(playlistArray));
    console.log(playlistArray);
  }
}

export default function FullMusicPlayer({route, navigation}) {
  const {trackTitle, artist, artworkURL} = route.params;
  const [isLiked, setIsLiked] = useState(false);
  const playbackState = usePlaybackState();
  const progress = useProgress();

  useEffect(() => {
    checkLikedState(setIsLiked);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.musicInfo}>
        <View style={styles.artworkContainer}>
          <Image
            style={styles.artwork}
            source={{
              uri: artworkURL,
            }}
          />
        </View>
        <Text numberOfLines={1} style={styles.textBold} ellipsizeMode="tail">
          {trackTitle}
        </Text>
        <Text style={styles.text}>{artist}</Text>
      </View>
      <View style={styles.sliderControls}>
        <Text style={styles.progressLabelText}>
          {new Date(progress.position * 1000).toISOString().substr(14, 5)}
        </Text>
        <Slider
          style={styles.progressContainer}
          value={progress.position}
          minimumValue={0}
          maximumValue={progress.duration}
          thumbTintColor="#047AFF"
          minimumTrackTintColor="#047AFF"
          maximumTrackTintColor="#FFFFFF"
          onSlidingComplete={async value => {
            await TrackPlayer.seekTo(value);
          }}
        />
        <Text style={styles.progressLabelText}>
          {new Date((progress.duration - progress.position) * 1000)
            .toISOString()
            .substr(14, 5)}
        </Text>
      </View>
      <View style={styles.musicControls}>
        <Icon.Button
          name="plus"
          style={{paddingRight: 0}}
          size={30}
          backgroundColor="transparent"
        />
        <Icon.Button
          name="stepbackward"
          size={30}
          backgroundColor="transparent"
          style={{paddingRight: 0}}
          onPress={() => TrackPlayer.skipToPrevious()}
        />

        <Icon.Button
          name={playbackState === State.Playing ? 'pause' : 'caretright'}
          backgroundColor="transparent"
          size={30}
          style={{paddingRight: 0}}
          onPress={() => toggle()}
        />
        <Icon.Button
          name="stepforward"
          size={30}
          backgroundColor="transparent"
          style={{paddingRight: 0}}
          onPress={() => TrackPlayer.skipToNext()}
        />
        <Icon.Button
          style={{paddingRight: 0}}
          name={isLiked ? 'heart' : 'hearto'}
          size={30}
          backgroundColor="transparent"
          onPress={() => addToPlaylist('likes', isLiked, setIsLiked)}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#272727',
    alignItems: 'center',
  },
  musicInfo: {
    textAlign: 'left',
    width: '100%',
  },
  sliderControls: {
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  artworkContainer: {
    width: '100%',
    alignItems: 'center',
  },
  artwork: {
    width: 350,
    height: 350,
    marginBottom: 60,
  },
  progressContainer: {
    width: '70%',
    flexDirection: 'row',
  },
  progressLabelText: {
    fontSize: 15,
    color: 'grey',
  },
  textBold: {
    color: 'white',
    marginLeft: 30,
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily: 'Product Sans Regular',
  },
  text: {
    color: 'white',
    margin: 30,
    fontSize: 15,
    fontFamily: 'Product Sans Regular',
  },

  musicControls: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 50,
  },
});
