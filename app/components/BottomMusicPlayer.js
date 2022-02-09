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
async function toggle() {
  const state = await TrackPlayer.getState();

  if (state === State.Playing) {
    TrackPlayer.pause();
  } else {
    TrackPlayer.play();
  }
}
async function start(setTrackTitle) {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  if (currentTrack !== null) {
    let trackIndex = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackIndex);
    setTrackTitle(trackObject.title);
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
  // Add a track to the queue
  //await TrackPlayer.add({
  //  url: 'https://rr4---sn-1puv-2iae.googlevideo.com/videoplayback?expire=1644213806&ei=zmEAYrLtAsHo8wTzlYGwAQ&ip=67.63.119.182&id=o-AGCCupiekhgeWtU6_7nOLvOhCLI6DZynFoFYhviS8EUi&itag=251&source=youtube&requiressl=yes&mh=ms&mm=31%2C29&mn=sn-1puv-2iae%2Csn-ab5l6n6l&ms=au%2Crdu&mv=m&mvi=4&pl=22&gcr=us&initcwndbps=1332500&vprv=1&mime=audio%2Fwebm&ns=vHPjeqmIMjnBjxiC0yrfWJAG&gir=yes&clen=3757070&dur=224.601&lmt=1631368289831537&mt=1644191820&fvip=4&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=5431432&n=oF_TYF12iwuaXWaZg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cgcr%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRAIgDTNSTGpMt3va0L5ka3EN2AVXkIcwV25WIpE5ktroCVMCIG1qqJOvmf89Z7A2XnW9zq6euy6fTJyIvOXHQbmWwOdt&sig=AOq0QJ8wRQIhAMI3SDC1wQ_LOQ_QItTE8MZwMt-0nutdRpKcjiT1h1I7AiA0-Dtku3xTP7D6MAuwV-a17zk23EbCAlvzC5qoBhcwZA==',
  //  title: 'Track 1',
  //  artist: 'Track Artist',
  //});
  //await TrackPlayer.add({
  //  url: 'https://rr4---sn-1puv-2iae.googlevideo.com/videoplayback?expire=1644213806&ei=zmEAYrLtAsHo8wTzlYGwAQ&ip=67.63.119.182&id=o-AGCCupiekhgeWtU6_7nOLvOhCLI6DZynFoFYhviS8EUi&itag=251&source=youtube&requiressl=yes&mh=ms&mm=31%2C29&mn=sn-1puv-2iae%2Csn-ab5l6n6l&ms=au%2Crdu&mv=m&mvi=4&pl=22&gcr=us&initcwndbps=1332500&vprv=1&mime=audio%2Fwebm&ns=vHPjeqmIMjnBjxiC0yrfWJAG&gir=yes&clen=3757070&dur=224.601&lmt=1631368289831537&mt=1644191820&fvip=4&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=5431432&n=oF_TYF12iwuaXWaZg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cgcr%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRAIgDTNSTGpMt3va0L5ka3EN2AVXkIcwV25WIpE5ktroCVMCIG1qqJOvmf89Z7A2XnW9zq6euy6fTJyIvOXHQbmWwOdt&sig=AOq0QJ8wRQIhAMI3SDC1wQ_LOQ_QItTE8MZwMt-0nutdRpKcjiT1h1I7AiA0-Dtku3xTP7D6MAuwV-a17zk23EbCAlvzC5qoBhcwZA==',
  //  title: 'Track 2',
  //  artist: 'Track Artist',
  //});
  TrackPlayer.setRepeatMode(RepeatMode.Queue);
}
export default function BottomMusicPlayer() {
  const progress = useProgress();
  const playbackState = usePlaybackState();
  const [trackTitle, setTrackTitle] = useState('none');

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (
      event.type === Event.PlaybackTrackChanged &&
      event.nextTrack !== undefined
    ) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, artist, artwork} = track || {};
      setTrackTitle(title);
    }
  });
  useEffect(() => {
    start(setTrackTitle);
  }, []);
  return (
    <View style={styles.musicControls}>
      <Text maxLines={1} style={styles.text}>
        {trackTitle}
      </Text>
      <Icon.Button
        name="stepbackward"
        size={30}
        backgroundColor="black"
        onPress={() => TrackPlayer.skipToPrevious()}
      />

      <Icon.Button
        name={playbackState === State.Playing ? 'pause' : 'caretright'}
        backgroundColor="black"
        size={30}
        style={styles.audioButton}
        onPress={() => toggle()}
      />
      <Icon.Button
        name="stepforward"
        size={30}
        backgroundColor="black"
        onPress={() => TrackPlayer.skipToNext()}
      />
    </View>
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
