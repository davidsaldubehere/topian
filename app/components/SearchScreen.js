import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  SafeAreaView,
  ScrollView,
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
async function search(searchText, setSearchItems, searchItems) {
  let url = 'https://topian.pythonanywhere.com';
  let response = await fetch(`${url}/search/${searchText}`);
  let json = await response.json();
  let titles = json.titles;
  let artists = json.artists;
  let videoId = json.videoId;
  //no freaking idea why this has to be done this garbo way but it works
  let allSearchObj = [];
  for (let i = 0; i < titles.length; i++) {
    allSearchObj.push({
      title: titles[i],
      artist: artists[i],
      videoId: videoId[i],
      id: Math.random() * 1000,
    });
  }
  console.log(allSearchObj);
  setSearchItems(allSearchObj);
  //await setSearchItems([
  //  ...searchItems,
  //  {title: titles[0], artist: artists[1], id: Math.random() * 1000},
  //  {title: titles[1], artist: artists[2], id: Math.random() * 1000},
  //  {title: titles[2], artist: artists[2], id: Math.random() * 1000},
  //  {title: titles[3], artist: artists[2], id: Math.random() * 1000},
  //]);

  console.log(titles[3]);
}
const SearchScreen = ({navigation, trackTitle, setTrackTitle}) => {
  const playbackState = usePlaybackState();

  const [searchItems, setSearchItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <View style={styles.search}>
          <TextInput
            style={styles.input}
            placeholder="Search for a song..."
            keyboardType="ascii-capable"
            selectionColor={'white'}
            onChangeText={setSearchText}
            placeholderTextColor={'grey'}
          />
          <Icon.Button
            name="search1"
            size={30}
            backgroundColor="transparent"
            onPress={() => search(searchText, setSearchItems, searchItems)}
          />
        </View>
        <SearchList searchItems={searchItems} />
      </View>
      <BottomMusicPlayer />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: 'white',
  },
  text: {
    color: 'white',
    margin: 30,
    fontWeight: 'bold',
    fontSize: 17,
    maxWidth: '40%',
  },
  top: {
    position: 'absolute',
    top: 0,
    width: '100%',
    alignItems: 'center',
  },
  search: {
    width: '100%',
    maxWidth: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    color: 'white',
    width: '80%',
    borderColor: 'white',
    borderRadius: 15,
  },
  musicControls: {
    width: '100%',
    position: 'relative',
    backgroundColor: 'black',
    borderTopColor: 'blue',
    borderTopWidth: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default SearchScreen;
