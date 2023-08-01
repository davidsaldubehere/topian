import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableNativeFeedback,
  Image,
  Modal,
  Vibration,
  Animated,
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
import ytdl from 'react-native-ytdl';
import PlaylistModal from './PlaylistModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addSongToQueue} from './Helpers';
async function removeFromPlaylist(playlist, title, setReloadPlaylist) {
  let previousState = await AsyncStorage.getItem(playlist);
  let playlistArray = JSON.parse(previousState);
  console.log('removing from playlist', playlist, title);
  console.log(previousState);
  playlistArray = playlistArray.filter(song => song.title !== title);
  await AsyncStorage.setItem(playlist, JSON.stringify(playlistArray));
  console.log(playlistArray);
  setReloadPlaylist(true);
}
const SearchItem = ({
  artist,
  title,
  videoId,
  thumbnail,
  resultType,
  editable,
  playlist,
  setReloadPlaylist,
  tracks,
  navigation,
}) => {
  const [queueModalVisible, setQueueModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true, // <-- Add this
    }).start();
  }, [fadeAnim]);
  return (
    <TouchableNativeFeedback
      delayLongPress={1000}
      onLongPress={() => {
        setQueueModalVisible(!queueModalVisible);
      }}
      onPress={() =>
        addSongToQueue(
          artist,
          title,
          videoId,
          thumbnail,
          resultType,
          true,
          tracks,
          navigation,
        )
      }>
      <Animated.View style={{...styles.searchItem, opacity: fadeAnim}}>
        <View style={styles.infoContainer}>
          <Text style={styles.textBold}>Title: {title}</Text>
          <Text style={styles.text}>Artist: {artist}</Text>
          <Text style={styles.text}>Type: {resultType}</Text>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={queueModalVisible}
          onRequestClose={() => {
            setQueueModalVisible(!queueModalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Select an action</Text>
              <TouchableNativeFeedback
                onPress={() => {
                  addSongToQueue(
                    artist,
                    title,
                    videoId,
                    thumbnail,
                    resultType,
                    false,
                  );
                  setQueueModalVisible(!queueModalVisible);
                }}>
                <Text style={styles.modalText}>Add To Queue</Text>
              </TouchableNativeFeedback>
              <PlaylistModal
                size={20}
                object={{
                  title: title,
                  artist: artist,
                  videoId: videoId,
                  thumbnail: thumbnail,
                }}></PlaylistModal>
              <TouchableNativeFeedback
                style={styles.button}
                onPress={() => setQueueModalVisible(!queueModalVisible)}>
                <Text style={styles.modalText}>Hide</Text>
              </TouchableNativeFeedback>
            </View>
          </View>
        </Modal>

        <View style={styles.searchEnd}>
          <Image
            style={styles.tinyThumb}
            source={{
              uri: thumbnail,
            }}
          />
          {editable ? (
            <Icon.Button
              name="close"
              style={{paddingRight: 0, paddingTop: 6}}
              size={30}
              backgroundColor="transparent"
              onPress={() =>
                removeFromPlaylist(playlist, title, setReloadPlaylist)
              }
            />
          ) : (
            <Icon.Button
              name="bars"
              style={{paddingRight: 0, paddingTop: 6}}
              size={30}
              backgroundColor="transparent"
              onPress={() => setQueueModalVisible(!queueModalVisible)}
            />
          )}
        </View>
      </Animated.View>
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
    borderWidth: 0,
    borderRadius: 10,
    width: '100%',
    marginTop: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchEnd: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalView: {
    position: 'absolute',
    top: '40%',
    backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  modalText: {
    color: 'white',
    fontSize: 20,
    margin: 20,
    //fontFamily: 'Product Sans Regular',
  },
  button: {
    borderRadius: 7,
    borderColor: 'white',
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
    borderRadius: 10,
  },
});
export default SearchItem;
