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
async function addSongToQueue(artist, title, videoId) {
  let url = 'https://topian.pythonanywhere.com';
  let response = await fetch(`${url}/download/${videoId}`);
  let source = await response.text();
  TrackPlayer.add({
    url: source,
    artist: artist,
    title: title,
  });
}
const SearchItem = ({artist, title, videoId, thumbnail}) => {
  return (
    <TouchableNativeFeedback
      onPress={() => addSongToQueue(artist, title, videoId)}>
      <View style={styles.searchItem}>
        <View style={styles.infoContainer}>
          <Text style={styles.textBold}>Song: {title}</Text>
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
    borderWidth: 3,
    borderRadius: 10,
    width: '90%',
    margin: 5,
  },
  infoContainer: {
    alignContent: 'flex-start',

    margin: 5,
  },
  text: {
    color: 'white',
    marginRight: 10,
  },
  textBold: {
    fontWeight: 'bold',
    color: 'white',
  },
  tinyThumb: {
    position: 'relative',
    width: 50,
    height: 50,
  },
});
export default SearchItem;
