import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  SafeAreaView,
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
import SearchItem from './app/components/SearchItem';

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
  await TrackPlayer.add({
    url: 'https://rr4---sn-1puv-2iae.googlevideo.com/videoplayback?expire=1644021545&ei=yXL9Yd6cMqmA2LYP6L6Z-AQ&ip=67.63.119.182&id=o-AIK5shslFuofYSTXXiwftD5JnpNdzgf1JMY3vAb9VQ6L&itag=251&source=youtube&requiressl=yes&mh=ms&mm=31%2C29&mn=sn-1puv-2iae%2Csn-ab5sznly&ms=au%2Crdu&mv=m&mvi=4&pcm2cms=yes&pl=22&gcr=us&initcwndbps=1428750&vprv=1&mime=audio%2Fwebm&ns=rJ7_da4Ks29Yj4BBo4lo-KUG&gir=yes&clen=3757070&dur=224.601&lmt=1631368289831537&mt=1643999588&fvip=4&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=5431432&n=ZMcv2ekMsYVTQyseW&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cgcr%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpcm2cms%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAL--nbFGOxxeLDrI6I1UFenZsvwhussTWYmGXs41rRqVAiEA4dancOnsrF48HlpOlOeuGE97qf-u9CTSdoeAQnlT5lE%3D&sig=AOq0QJ8wRAIgBHrr1zUqVhxMQbw2oSthIsBGUoEiEgH68bb3MQcPq1ECIGmvWyOLwC_ko5ZK1Fth-k0vhJqTMScejI6CBQLX57AB',
    title: 'Track 1',
    artist: 'Track Artist',
  });
  await TrackPlayer.add({
    url: 'https://rr4---sn-1puv-2iae.googlevideo.com/videoplayback?expire=1644021545&ei=yXL9Yd6cMqmA2LYP6L6Z-AQ&ip=67.63.119.182&id=o-AIK5shslFuofYSTXXiwftD5JnpNdzgf1JMY3vAb9VQ6L&itag=251&source=youtube&requiressl=yes&mh=ms&mm=31%2C29&mn=sn-1puv-2iae%2Csn-ab5sznly&ms=au%2Crdu&mv=m&mvi=4&pcm2cms=yes&pl=22&gcr=us&initcwndbps=1428750&vprv=1&mime=audio%2Fwebm&ns=rJ7_da4Ks29Yj4BBo4lo-KUG&gir=yes&clen=3757070&dur=224.601&lmt=1631368289831537&mt=1643999588&fvip=4&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=5431432&n=ZMcv2ekMsYVTQyseW&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cgcr%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpcm2cms%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAL--nbFGOxxeLDrI6I1UFenZsvwhussTWYmGXs41rRqVAiEA4dancOnsrF48HlpOlOeuGE97qf-u9CTSdoeAQnlT5lE%3D&sig=AOq0QJ8wRAIgBHrr1zUqVhxMQbw2oSthIsBGUoEiEgH68bb3MQcPq1ECIGmvWyOLwC_ko5ZK1Fth-k0vhJqTMScejI6CBQLX57AB',
    title: 'Track 2',
    artist: 'Track Artist',
  });
  TrackPlayer.setRepeatMode(RepeatMode.Queue);
}
async function toggle() {
  const state = await TrackPlayer.getState();

  if (state === State.Playing) {
    TrackPlayer.pause();
  } else {
    TrackPlayer.play();
  }
}
export default function App() {
  const progress = useProgress();
  const playbackState = usePlaybackState();
  const [trackTitle, setTrackTitle] = useState('trackObject.title');
  const [searchItems, setSearchItems] = useState([]);
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
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <TextInput
          style={styles.input}
          placeholder="Search for a song..."
          keyboardType="ascii-capable"
          selectionColor={'white'}
          placeholderTextColor={'grey'}
        />
        {searchItems.map(item => (
          <SearchItem title={item.title} artist={item.title} />
        ))}
      </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: 'white',
  },
  text: {
    color: 'white',
    margin: 30,
    fontWeight: 'bold',
    fontSize: 17,
    maxWidth: '40%',
    flex: 1,
  },
  top: {
    position: 'absolute',
    top: 10,
    width: '90%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: 'white',
    width: '100%',
    borderColor: 'white',
    borderRadius: 10,
  },
  musicControls: {
    width: '100%',
    backgroundColor: 'black',
    borderTopColor: 'blue',
    borderTopWidth: 10,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
