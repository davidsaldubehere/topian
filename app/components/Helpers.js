import AsyncStorage from '@react-native-async-storage/async-storage';
import ytdl from 'react-native-ytdl';
import TrackPlayer from 'react-native-track-player';
export async function addToHistory(songObj) {
  let currentKeys = await AsyncStorage.getAllKeys();
  if (!currentKeys.includes('history')) {
    await AsyncStorage.setItem('history', JSON.stringify([songObj]));
    console.log('created new key', 'history');
  } else {
    let previousState = await AsyncStorage.getItem('history');
    let historyArray = JSON.parse(previousState);
    historyArray.push(songObj);
    await AsyncStorage.setItem('history', JSON.stringify(historyArray));
    console.log('Current history array: ', historyArray);
  }
}
export async function validateURL(url) {
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
export async function getHistory() {
  let historyArray = await AsyncStorage.getItem('history');
  return JSON.parse(historyArray);
}
export async function getPlaylists(setPlaylists) {
  let keys = await AsyncStorage.getAllKeys();
  keys = keys.filter(key => key != 'noOneWillGuessThisKey7657');
  setPlaylists(keys);
}
//to do - change this name to something that reflects album functionality too
export async function addSongToQueue(
  artist,
  title,
  videoId,
  thumbnail,
  resultType,
  restart,
  tracks,
  navigation,
) {
  if (resultType === 'album') {
    let albumTracks = [];
    for (let i = 0; i < tracks.artists.length; i++) {
      albumTracks.push({
        title: tracks.titles[i],
        artist: tracks.artists[i],
        videoId: tracks.videoIds[i],
      });
    }
    await AsyncStorage.setItem(
      'noOneWillGuessThisKey7657',
      JSON.stringify(albumTracks),
    );
    let key = title;
    navigation.navigate('Playlist', {
      playlistName: key.charAt(0).toUpperCase() + key.slice(1),
      playlistKey: 'noOneWillGuessThisKey7657',
    });
  } else {
    const youtubeURL = `http://www.youtube.com/watch?v=${videoId}`;
    let source = await ytdl(youtubeURL, {quality: 'highestaudio'});
    console.log('received song');
    if (restart) {
      await TrackPlayer.reset();
      console.log('reset track player');
    }
    let testSource = source;
    while (true) {
      if (!(await validateURL(testSource[0].url))) {
        break;
      }
      testSource = await ytdl(youtubeURL, {quality: 'highestaudio'});
    }
    await TrackPlayer.add({
      artwork: thumbnail,
      url: testSource[0].url,
      artist: artist,
      title: title,
      id: videoId,
    });
    console.log('added song to queue');
    TrackPlayer.play();
  }
}
