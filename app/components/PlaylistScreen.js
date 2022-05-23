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
  InteractionManager,
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
import {useFocusEffect} from '@react-navigation/native';
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
  //console.log(
  //  await validateURL(
  //    'https://rr4---sn-1puv-2iae.googlevideo.com/videoplayback?expire=1646608840&ei=aO0kYuqsJo7OgwOE_6vQAw&ip=67.63.119.182&id=o-AKXPpBFU4dPhscmRdaK_mI7V_tdgB18aC9dR14_8IRHb&itag=251&source=youtube&requiressl=yes&mh=gq&mm=31%2C29&mn=sn-1puv-2iae%2Csn-ab5sznld&ms=au%2Crdu&mv=m&mvi=4&pl=22&gcr=us&initcwndbps=1503750&vprv=1&mime=audio%2Fwebm&ns=kwMMg7LXPGtFncD4kJA7h9EG&gir=yes&clen=4011840&dur=257.481&lmt=1583268244888739&mt=1646586767&fvip=5&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=5531432&n=n9vCa0kSYMa5Wfwg1&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cgcr%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRAIgG8Pbn14FtcgAI7o1OskvmX6AhwXVfTgqz-_nLxkT6QcCIC2GWOvWrDMiUKi6mIcoNysh59VgH6xuds4oYC71t1kH&ratebypass=yes&sig=AOq0QJ8wRQIhAMDrE7BrxstReZ9A5OI7n6Hk7Gao4KfE0JaarL2VbEZVAiBQUVPBfmNELKi3UDm0Kz7ddOmkeMC-fAgO3ekizLGWUA%3D%3D',
  //  ),
  //);
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
async function validateURL(url) {
  //make sure the url does not return a 403 error

  //use the headers to make a request via fetch api
  let response = await fetch('https://topian.pythonanywhere.com/validate', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: url,
    }),
  });
  console.log(
    'since react fetch wont fucking let me spoof my header im using my own server server',
  );
  let responseJson = await response.json();
  console.log(responseJson);
  if (responseJson.yeet == '403') {
    return true;
  }
  return false;
}
async function playAll(key, shouldShuffle, startIndex) {
  let playlist = await AsyncStorage.getItem(key);
  playlist = JSON.parse(playlist);
  if (shouldShuffle) {
    playlist = shuffle(playlist);
  }
  await TrackPlayer.reset();
  for (let i = 0; i < playlist.length; i++) {
    console.log(key, `loading ${i} song`);
    let youtubeURL = `http://www.youtube.com/watch?v=${playlist[i].videoId}`;
    let source = await ytdl(youtubeURL, {quality: 'highestaudio'});
    //this isnt fast enough for some reason
    if (await validateURL(source[0].url)) {
      console.log('invalid url');
      console.log('trying again');
      source = await ytdl(youtubeURL, {quality: 'highestaudio'});
    }
    let temp = {
      artwork: playlist[i].thumbnail,
      url: source[0].url,
      artist: playlist[i].artist,
      title: playlist[i].title,
      id: playlist[i].videoId,
    };
    console.log('adding from playList ' + temp + ' \n');
    await TrackPlayer.add(temp);
    if (i === 0) {
      await TrackPlayer.play();
    }
  }
}
export default function PlaylistScreen({route, navigation}) {
  const {playlistName, playlistKey} = route.params;
  const [playlistItems, setPlaylistItems] = useState([]);
  const [editable, setEditable] = useState(false);
  const [reloadPlaylist, setReloadPlaylist] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        loadPlaylist(playlistKey, setPlaylistItems);
      });

      return () => task.cancel();
    }, []),
  );
  if (reloadPlaylist) {
    loadPlaylist(playlistKey, setPlaylistItems);
    setReloadPlaylist(false);
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.playlistHeader}>
        <Text style={styles.textBold}>{playlistName}</Text>
        <View style={styles.playlistControls}>
          <Icon.Button
            name="play"
            size={30}
            style={{paddingRight: 0}}
            color={'grey'}
            backgroundColor="transparent"
            onPress={() => playAll(playlistKey, false)}
          />
          <Icon.Button
            name="edit"
            size={30}
            style={{paddingRight: 0}}
            color={'grey'}
            backgroundColor="transparent"
            onPress={() => setEditable(!editable)}
          />
          <Icon.Button
            name="swap"
            size={30}
            style={{paddingRight: 0}}
            color={'grey'}
            backgroundColor="transparent"
            onPress={() => playAll(playlistKey, true)}
          />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {playlistItems.map(item => (
          <SearchItem
            title={item.title}
            artist={item.artist}
            videoId={item.videoId}
            thumbnail={`http://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
            editable={editable}
            resultType="song"
            key={Math.random() * 1000}
            playlist={playlistKey}
            setReloadPlaylist={setReloadPlaylist}
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
    //backgroundColor: 'rgba(0,0,0,0.6)',
    backgroundColor: '#121212',
    color: 'white',
  },
  playlistHeader: {
    marginTop: 20,
    marginBottom: 20,
    borderBottomColor: 'grey',
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
