import React, {useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableNativeFeedback,
  Modal,
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
import Icon from 'react-native-vector-icons/AntDesign';
import iconButton from 'react-native-vector-icons/dist/lib/icon-button';
import SearchItem from './SearchItem';
import SearchList from './SearchList';
import BottomMusicPlayer from './BottomMusicPlayer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getPlaylists} from './Helpers';
async function createPlaylist(newPlaylistName, setPlaylists, setModalVisible) {
  await AsyncStorage.setItem(newPlaylistName, JSON.stringify([]));
  getPlaylists(setPlaylists);
  setModalVisible(false);
}
export default function Playlists({navigation}) {
  const [playlists, setPlaylists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        getPlaylists(setPlaylists);
      });

      return () => task.cancel();
    }, []),
  );
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>New playlist name</Text>
            <View style={styles.search}>
              <TextInput
                style={styles.input}
                placeholder="Example: favorites"
                keyboardType="ascii-capable"
                selectionColor={'white'}
                onChangeText={setNewPlaylistName}
                placeholderTextColor={'grey'}
              />
              <Icon.Button
                name="plus"
                size={30}
                backgroundColor="transparent"
                style={{paddingRight: 0}}
                onPress={() => {
                  createPlaylist(
                    newPlaylistName,
                    setPlaylists,
                    setModalVisible,
                  );
                }}
              />
            </View>
            <TouchableNativeFeedback
              style={styles.button}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.modalText}>Hide</Text>
            </TouchableNativeFeedback>
          </View>
        </View>
      </Modal>
      <Icon.Button
        style={{paddingRight: 0}}
        name="plus"
        backgroundColor="#272727"
        onPress={() => setModalVisible(!modalVisible)}
        size={100}
      />
      {playlists.map(key => (
        <TouchableNativeFeedback
          key={key}
          onPress={() =>
            navigation.navigate('Playlist', {
              playlistName: key.charAt(0).toUpperCase() + key.slice(1),
              playlistKey: key,
            })
          }>
          <View style={styles.playlist}>
            <Text style={styles.playlistText}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
          </View>
        </TouchableNativeFeedback>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    position: 'absolute',
    top: '40%',
    backgroundColor: '#272727',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  modalText: {
    color: 'white',
    fontSize: 20,
    margin: 15,
    fontFamily: 'Product Sans Regular',
  },
  search: {
    maxWidth: '80%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 0,
    backgroundColor: '#212121',
    padding: 10,
    color: 'white',
    width: '80%',
    borderColor: 'white',
    borderRadius: 12,
    fontSize: 15,
  },
  playlist: {
    backgroundColor: '#272727',
    width: 120,
    height: 120,
    marginLeft: 10,
    borderRadius: 5,
  },
  playlistText: {
    fontFamily: 'Product Sans Regular',

    textAlign: 'center',
    fontSize: 20,
    position: 'relative',
    top: 50,
    color: '#fff',
  },
});
