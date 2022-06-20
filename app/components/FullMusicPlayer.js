import React, {useState, useCallback, useRef, useMemo} from 'react';
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
import {Dimensions} from 'react-native';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
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

async function loadSongInformation(videoId, setScrollText) {
  let url = 'https://topian.pythonanywhere.com/getVideoData';
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      videoId: videoId,
    }),
  });
  console.log(videoId);
  let responseJson = await response.json();
  setScrollText(
    `${responseJson.views} views (on youtube)\n\nPublished on ${responseJson.date}`,
  );
}
export default function FullMusicPlayer({
  trackTitle,
  artist,
  videoId,
  isLiked,
  setIsLiked,
  specialColor,
  navigation,
}) {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const bottomSheetRef = useRef(0);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  // variables
  const [scrollText, setScrollText] = useState('No information available');
  const snapPoints = useMemo(() => ['20%', '90%'], []);
  const handleSheetChanges = index => {
    if (index == 1) {
      loadSongInformation(videoId, setScrollText);
    }
  };

  //to do: fix some thumbnails not having a max res thumbnail
  //make the edge of the text align with the image by putting another div in there
  return (
    <SafeAreaView style={styles.sliderSpace}>
      <View style={styles.bottomSheetContainer}>
        <View style={styles.artworkContainer}>
          <View style={styles.goBack}>
            <Icon.Button
              name="down"
              size={30}
              color="white"
              backgroundColor="transparent"
              style={{paddingRight: 0}}
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>

          <Image
            style={{
              width: windowWidth - 30,
              height: windowWidth - 30,
              borderRadius: 10,
            }}
            source={{
              uri: `http://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            }}
          />

          <View style={styles.textContainer}>
            <Text
              numberOfLines={1}
              style={styles.textBold}
              ellipsizeMode="tail">
              {trackTitle}
            </Text>
            <Text style={styles.text}>{artist}</Text>
          </View>
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          handleIndicatorStyle={styles.handleIndicator}
          snapPoints={snapPoints}
          backgroundStyle={styles.bottomSheetBackground}
          activeOffsetY={[-1, 1]}
          failOffsetX={[-5, 5]}
          onChange={handleSheetChanges}>
          <View style={styles.bottomSheet}>
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
                style={{
                  paddingRight: 0,
                  borderColor:
                    playbackState === State.Playing ? specialColor : '#047AFF',
                  borderWidth: 4,
                  borderRadius: 20,
                  padding: 10,
                }}
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
            <View style={styles.lyricContainer}>
              <BottomSheetScrollView>
                <Text style={styles.lyricText}>{scrollText}</Text>
              </BottomSheetScrollView>
            </View>
          </View>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  sliderSpace: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
  },
  goBack: {
    width: '100%',
    marginLeft: 30,
  },
  artworkContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'space-around',
    maxHeight: '80%',
    alignItems: 'center',
  },
  textContainer: {
    width: '100%',
    marginLeft: 30,
  },
  textBold: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily: 'Product Sans Regular',
    marginTop: 5,
  },
  text: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Product Sans Regular',
    marginTop: 10,
  },
  bottomSheetContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#272727',
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#121212',

    alignItems: 'center',
  },
  bottomSheetBackground: {
    backgroundColor: '#121212',
  },
  handleIndicator: {
    backgroundColor: 'white',
  },
  musicControls: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  sliderControls: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    width: '70%',
    flexDirection: 'row',
  },
  progressLabelText: {
    fontSize: 15,
    color: 'grey',
  },
  lyricContainer: {
    marginTop: 70,
  },
  lyricText: {
    color: 'white',
    fontFamily: 'Product Sans Regular',

    fontSize: 20,
    marginBottom: 30,
    textAlign: 'left',
    width: '100%',
  },
});
