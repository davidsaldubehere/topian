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
import SearchList from './app/components/SearchList';

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
async function toggle() {
  const state = await TrackPlayer.getState();

  if (state === State.Playing) {
    TrackPlayer.pause();
  } else {
    TrackPlayer.play();
  }
}
async function search(searchText, setSearchItems, searchItems) {
  let url = 'https://topian.pythonanywhere.com';
  let response = await fetch(`${url}/search/${searchText}`);
  let json = await response.json();
  let titles = json.titles;
  let artists = json.artists;
  let videoId = json.videoId;
  //no freaking idea why this has to be done this garbo way but it works
  let allSearchObj = [];
  for (let i = 0; i < titles.length; i++) {
    allSearchObj.push({
      title: titles[i],
      artist: artists[i],
      videoId: videoId[i],
      id: Math.random() * 1000,
    });
  }
  console.log(allSearchObj);
  setSearchItems(allSearchObj);
  //await setSearchItems([
  //  ...searchItems,
  //  {title: titles[0], artist: artists[1], id: Math.random() * 1000},
  //  {title: titles[1], artist: artists[2], id: Math.random() * 1000},
  //  {title: titles[2], artist: artists[2], id: Math.random() * 1000},
  //  {title: titles[3], artist: artists[2], id: Math.random() * 1000},
  //]);

  console.log(titles[3]);
}
export default function App() {
  const progress = useProgress();
  const playbackState = usePlaybackState();
  const [trackTitle, setTrackTitle] = useState('none');
  const [searchItems, setSearchItems] = useState([]);
  const [searchText, setSearchText] = useState('');
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
        <View style={styles.search}>
          <TextInput
            style={styles.input}
            placeholder="Search for a song..."
            keyboardType="ascii-capable"
            selectionColor={'white'}
            onChangeText={setSearchText}
            placeholderTextColor={'grey'}
          />
          <Icon.Button
            name="search1"
            size={30}
            backgroundColor="transparent"
            onPress={() => search(searchText, setSearchItems, searchItems)}
          />
        </View>
        <SearchList searchItems={searchItems} />
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
  search: {
    width: '60%',
    flexDirection: 'row',
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
