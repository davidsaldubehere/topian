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
import FullMusicPlayer from './FullMusicPlayer';
async function start(setTrackTitle, setArtist, setVideoId) {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  if (currentTrack !== null) {
    let trackIndex = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackIndex);
    setTrackTitle(trackObject.title);
    setArtist(trackObject.artist);
    setVideoId(trackObject.id);
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
function detectTarget(navigation, target, trackTitle, artist, videoId) {
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
      />
    );
  }
}
export default function GlobalMusicPlayer({navigation, target}) {
  const [trackTitle, setTrackTitle] = useState('none');
  const [artist, setArtist] = useState('none');
  const [videoId, setVideoId] = useState('none');
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
    }
  });
  useEffect(() => {
    start(setTrackTitle, setArtist, setVideoId);
  }, []);
  return (
    <View style={{flex: target != 'bottom' ? 1 : 0}}>
      {detectTarget(navigation, target, trackTitle, artist, videoId)}
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
