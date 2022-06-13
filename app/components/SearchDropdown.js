import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableNativeFeedback,
  Animated,
} from 'react-native';

async function search(searchText, setSearchItems, filter, setIsLoading) {
  let url = 'https://topian.pythonanywhere.com';
  await setSearchItems([]);
  await setIsLoading(true);

  let response = await fetch(`${url}/search${filter}/${searchText}`);
  let json = await response.json();
  let titles = json.titles;
  let artists = json.artists;
  let thumbnails = json.thumbnails;
  let resultType = json.resultType;
  let allSearchObj = [];
  if (filter == 'Albums') {
    let tracks = json.tracks;
    for (let i = 0; i < titles.length; i++) {
      allSearchObj.push({
        title: titles[i],
        artist: artists[i],
        thumbnail: thumbnails[i],
        resultType: resultType[i],
        tracks: tracks[i],
        id: Math.random() * 1000,
      });
    }
  } else {
    let videoId = json.videoIds;
    for (let i = 0; i < titles.length; i++) {
      allSearchObj.push({
        title: titles[i],
        artist: artists[i],
        videoId: videoId[i],
        thumbnail: thumbnails[i],
        resultType: resultType[i],
        id: Math.random() * 1000,
      });
    }
  }

  setSearchItems(allSearchObj);
  await setIsLoading(false);
  console.log(allSearchObj);
}

const SearchDropdown = ({searchText, setSearchItems, setIsLoading}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true, // <-- Add this
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...styles.searchFilters,
        opacity: fadeAnim, // Bind opacity to animated value
      }}>
      <TouchableNativeFeedback
        onPress={() => {
          search(searchText, setSearchItems, 'Songs', setIsLoading);
        }}>
        <Text style={styles.filterText}>Songs</Text>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback
        onPress={() => {
          search(searchText, setSearchItems, 'Videos', setIsLoading);
        }}>
        <Text style={styles.filterText}>Videos</Text>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback
        onPress={() => {
          search(searchText, setSearchItems, 'Albums', setIsLoading);
        }}>
        <Text style={styles.filterText}>Albums</Text>
      </TouchableNativeFeedback>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  searchFilters: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 10,
  },
  filterText: {
    margin: 2,
    padding: 10,
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#212121',
    fontFamily: 'Product Sans Regular',
    borderRadius: 10,
  },
});
export default SearchDropdown;
