import React from 'react';
import {Text, View, StyleSheet, TouchableNativeFeedback} from 'react-native';
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
const SearchItem = ({artist, title, videoId}) => {
  return (
    <TouchableNativeFeedback
      onPress={() => addSongToQueue(artist, title, videoId)}>
      <View style={styles.searchItem}>
        <Text style={styles.textBold}>Song: {title}</Text>
        <Text style={styles.text}>Artist: {artist}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  searchItem: {
    padding: 10,
    alignContent: 'flex-start',
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 10,
    width: '90%',
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
});
export default SearchItem;
