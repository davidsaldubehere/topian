import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
  TouchableNativeFeedback,
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
import PlaylistModal from './PlaylistModal';
import {getColorFromURL} from 'rn-dominant-color';

async function toggle() {
  const state = await TrackPlayer.getState();

  if (state === State.Playing) {
    TrackPlayer.pause();
  } else {
    TrackPlayer.play();
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
    if (playlist === 'likes') {
      await setIsLiked(true);
    }
    console.log('created new key', playlist);
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

export default function FullMusicPlayer({
  trackTitle,
  artist,
  videoId,
  isLiked,
  setIsLiked,
  specialColor,
}) {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  //to do: fix some thumbnails not having a max res thumbnail
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.musicInfo}>
        <View style={styles.artworkContainer}>
          <Image
            style={styles.artwork}
            source={{
              uri: `http://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            }}
          />
        </View>
        <Text
          nativeID="gay1"
          numberOfLines={1}
          style={styles.textBold}
          ellipsizeMode="tail">
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
          thumbTintColor={
            playbackState === State.Playing ? specialColor : '#047AFF'
          }
          minimumTrackTintColor={
            playbackState === State.Playing ? specialColor : '#047AFF'
          }
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
        <PlaylistModal size={30} object={null}></PlaylistModal>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    position: 'absolute',
    top: '40%',
    backgroundColor: '#272727',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  modalText: {
    color: 'white',
    fontSize: 20,
    margin: 20,
    fontFamily: 'Product Sans Regular',
  },
  button: {
    borderRadius: 7,
    borderColor: 'white',
    width: '100%',
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
