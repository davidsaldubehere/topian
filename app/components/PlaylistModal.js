import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
  TouchableNativeFeedback,
} from 'react-native';
import Slider from '@react-native-community/slider';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import iconButton from 'react-native-vector-icons/dist/lib/icon-button';
async function toggle() {
  const state = await TrackPlayer.getState();

  if (state === State.Playing) {
    TrackPlayer.pause();
  } else {
    TrackPlayer.play();
  }
}

async function addToPlaylist(playlist, object) {
  if (object == null) {
    let trackIndex = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackIndex);
    var songObj = {
      title: trackObject.title,
      artist: trackObject.artist,
      videoId: trackObject.id,
      thumbnail: trackObject.artwork,
    };
  } else {
    var songObj = object;
  }
  let currentKeys = await AsyncStorage.getAllKeys();
  if (!currentKeys.includes(playlist)) {
    await AsyncStorage.setItem(playlist, JSON.stringify([songObj]));
    console.log('created new key', playlist);
  } else {
    let previousState = await AsyncStorage.getItem(playlist);
    let playlistArray = JSON.parse(previousState);
    console.log(previousState);
    playlistArray.push(songObj);
    await AsyncStorage.setItem(playlist, JSON.stringify(playlistArray));
    console.log(playlistArray);
  }
}
async function getPlaylists(setPlaylists) {
  let keys = await AsyncStorage.getAllKeys();
  setPlaylists(keys);
}
export default function PlaylistModal({size, object}) {
  const [playlists, setPlaylists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  //to do: fix some thumbnails not having a max res thumbnail
  useEffect(() => {
    getPlaylists(setPlaylists);
  }, []);

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        style={{backgroundColor: 'white'}}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select a playlist to add to</Text>
            {playlists.map(playlist => {
              return (
                <TouchableNativeFeedback
                  key={playlist}
                  onPress={() => {
                    addToPlaylist(playlist, object);
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.modalText}>{playlist}</Text>
                </TouchableNativeFeedback>
              );
            })}
            <TouchableNativeFeedback
              style={styles.button}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.modalText}>Hide</Text>
            </TouchableNativeFeedback>
          </View>
        </View>
      </Modal>

      <Icon.Button
        name="plus"
        style={{paddingRight: 0}}
        size={size}
        backgroundColor="transparent"
        onPress={() => setModalVisible(!modalVisible)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#272727',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: 'Product Sans Regular',
  },
  button: {
    borderRadius: 7,
    borderColor: 'white',
    width: '100%',
  },
  musicInfo: {
    textAlign: 'left',
    width: '100%',
  },
  sliderControls: {
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  artworkContainer: {
    width: '100%',
    alignItems: 'center',
  },
  artwork: {
    width: 350,
    height: 350,
    marginBottom: 60,
  },
  progressContainer: {
    width: '70%',
    flexDirection: 'row',
  },
  progressLabelText: {
    fontSize: 15,
    color: 'grey',
  },
  textBold: {
    color: 'white',
    marginLeft: 30,
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily: 'Product Sans Regular',
  },
  text: {
    color: 'white',
    margin: 30,
    fontSize: 15,
    fontFamily: 'Product Sans Regular',
  },

  musicControls: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 50,
  },
});
