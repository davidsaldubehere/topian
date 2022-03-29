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
async function toggle() {
  const state = await TrackPlayer.getState();
  if (state === State.Playing) {
    TrackPlayer.pause();
  } else {
    TrackPlayer.play();
  }
}

export default function BottomMusicPlayer({navigation, trackTitle}) {
  const playbackState = usePlaybackState();
  return (
    <TouchableNativeFeedback
      onPress={() => trackTitle != 'none' && navigation.navigate('Full')}>
      <View style={styles.musicControls}>
        <Text
          nativeID="gay"
          numberOfLines={1}
          style={styles.text}
          ellipsizeMode="tail">
          {trackTitle}
        </Text>
        <Icon.Button
          name="stepbackward"
          size={30}
          backgroundColor="transparent"
          style={{paddingRight: 0}}
          onPress={() => TrackPlayer.skipToPrevious()}
        />

        <Icon.Button
          name={playbackState === State.Playing ? 'pause' : 'caretright'}
          backgroundColor="transparent"
          size={30}
          style={{paddingRight: 0}}
          onPress={() => toggle()}
        />
        <Icon.Button
          name="stepforward"
          size={30}
          style={{paddingRight: 0}}
          backgroundColor="transparent"
          onPress={() => TrackPlayer.skipToNext()}
        />
      </View>
    </TouchableNativeFeedback>
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
