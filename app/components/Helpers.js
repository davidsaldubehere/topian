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
export async function getHistory() {
  let historyArray = await AsyncStorage.getItem('history');
  return JSON.parse(historyArray);
}
export async function addSongToQueue(
  artist,
  title,
  videoId,
  thumbnail,
  restart,
) {
  const youtubeURL = `http://www.youtube.com/watch?v=${videoId}`;
  let source = await ytdl(youtubeURL, {quality: 'highestaudio'});
  console.log('received song');
  if (restart) {
    await TrackPlayer.reset();
    console.log('reset track player');
  }
  //to do validate url before playing
  console.log('Search Item', videoId);
  await TrackPlayer.add({
    artwork: thumbnail,
    url: source[0].url,
    artist: artist,
    title: title,
    id: videoId,
  });
  //await addToHistory({
  //  title: title,
  //  id: videoId,
  //});
  console.log('added song to queue');
  TrackPlayer.play();
}
