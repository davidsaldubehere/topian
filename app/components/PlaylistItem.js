import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableNativeFeedback,
  Image,
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
import ytdl from 'react-native-ytdl';

async function addSongToQueue(artist, title, videoId, thumbnail) {
  //let url = 'http://nuggetapi.ddns.net';
  //let response = await fetch(`${url}/download/${videoId}`);
  //let source = await response.text();

  const youtubeURL = `http://www.youtube.com/watch?v=${videoId}`;
  let source = await ytdl(youtubeURL, {quality: 'highestaudio'});
  console.log('received song');
  await TrackPlayer.reset();
  console.log('reset track player');
  console.log('Search Item', videoId);
  await TrackPlayer.add({
    artwork: thumbnail,
    url: source[0].url,
    artist: artist,
    title: title,
    id: videoId,
  });
  console.log('added song to queue');
  TrackPlayer.play();
}
const PlaylistItem = ({artist, title, videoId, thumbnail}) => {
  return (
    <TouchableNativeFeedback
      onPress={() => addSongToQueue(artist, title, videoId, thumbnail)}>
      <View style={styles.searchItem}>
        <View style={styles.infoContainer}>
          <Text style={styles.textBold}>Title: {title}</Text>
          <Text style={styles.text}>Artist: {artist}</Text>
        </View>
        <Image
          style={styles.tinyThumb}
          source={{
            uri: thumbnail,
          }}
        />
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  searchItem: {
    padding: 10,
    flexDirection: 'row',
    borderColor: 'white',
    justifyContent: 'space-between',
    backgroundColor: '#272727',
    borderWidth: 3,
    borderRadius: 10,
    width: '100%',
    marginTop: 5,
  },
  infoContainer: {
    alignContent: 'flex-start',
    maxWidth: '60%',
    margin: 5,
  },
  text: {
    color: 'white',
    marginRight: 10,
    //fontFamily: 'Product Sans Regular',
  },
  textBold: {
    fontWeight: 'bold',
    color: 'white',
    //fontFamily: 'Product Sans Regular',
  },
  tinyThumb: {
    position: 'relative',
    width: 75,
    height: 75,
  },
});
export default PlaylistItem;
