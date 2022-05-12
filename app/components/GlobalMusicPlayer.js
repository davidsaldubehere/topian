import React, {useEffect, useState, createContext} from 'react';
import {StyleSheet, Text, View, TouchableNativeFeedback} from 'react-native';
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
import BottomMusicPlayer from './BottomMusicPlayer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FullMusicPlayer from './FullMusicPlayer';
import ytdl from 'react-native-ytdl';

async function start(setTrackTitle, setArtist, setVideoId, setIsLiked) {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  if (currentTrack !== null) {
    let trackIndex = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackIndex);
    setTrackTitle(trackObject.title);
    setArtist(trackObject.artist);
    setVideoId(trackObject.id);
    checkLikedState(setIsLiked);
    return;
  }
  // Set up the player
  await TrackPlayer.setupPlayer();
  //add notification capabilities
  await TrackPlayer.updateOptions({
    stopWithApp: false,
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
    ],
    compactCapabilities: [Capability.Play, Capability.Pause],
  });

  TrackPlayer.setRepeatMode(RepeatMode.Queue);
}
function detectTarget(
  navigation,
  target,
  trackTitle,
  artist,
  videoId,
  isLiked,
  setIsLiked,
) {
  if (target == 'bottom') {
    return (
      <BottomMusicPlayer navigation={navigation} trackTitle={trackTitle} />
    );
  } else {
    return (
      <FullMusicPlayer
        trackTitle={trackTitle}
        artist={artist}
        videoId={videoId}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
      />
    );
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
export default function GlobalMusicPlayer({navigation, target}) {
  const [trackTitle, setTrackTitle] = useState('none');
  const [artist, setArtist] = useState('none');
  const [videoId, setVideoId] = useState('none');
  const [isLiked, setIsLiked] = useState(false);
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (
      event.type === Event.PlaybackTrackChanged &&
      event.nextTrack !== undefined
    ) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, artist, id} = track || {};
      setTrackTitle(title);
      setArtist(artist);
      setVideoId(id);
      checkLikedState(setIsLiked);
    }
  });
  //useTrackPlayerEvents([Event.PlaybackError], async event => {
  //  const currentTrackIndex = await TrackPlayer.getCurrentTrack();
  //  console.log('critical error, reseting the source url (:');
  //  //query the youtube api for the new source url from currect tracks video id
  //  const {title, artist, artwork, id} =
  //    (await TrackPlayer.getTrack(currentTrackIndex)) || {};
  //  const youtubeURL = `http://www.youtube.com/watch?v=${id}`;
  //  let source = await ytdl(youtubeURL, {quality: 'highestaudio'});
  //  console.log('received new url, trying again');
  //  //change the current tracks source url to the new one
  //  await TrackPlayer.remove(currentTrackIndex);
  //  await TrackPlayer.add(
  //    {
  //      title: title,
  //      artist: artist,
  //      artwork: artwork,
  //      url: source[0].url,
  //      id: id,
  //    },
  //    currentTrackIndex,
  //  );
  //  await TrackPlayer.play();
  //});
  useEffect(() => {
    start(setTrackTitle, setArtist, setVideoId, setIsLiked);
  }, []);
  return (
    <View style={{flex: target != 'bottom' ? 1 : 0}}>
      {detectTarget(
        navigation,
        target,
        trackTitle,
        artist,
        videoId,
        isLiked,
        setIsLiked,
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  text: {
    color: 'white',
    margin: 30,
    fontWeight: 'bold',
    fontSize: 17,
    width: '30%',
    fontFamily: 'Product Sans Regular',
  },

  musicControls: {
    width: '100%',
    backgroundColor: '#272727',
    borderTopColor: '#047AFF',
    borderTopWidth: 5,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
