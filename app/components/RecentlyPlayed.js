import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  SafeAreaView,
  ScrollView,
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
import Icon from 'react-native-vector-icons/AntDesign';
import iconButton from 'react-native-vector-icons/dist/lib/icon-button';
import SearchItem from './SearchItem';
import SearchList from './SearchList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getHistory} from './Helpers';
import {addSongToQueue} from './Helpers';
import {useFocusEffect} from '@react-navigation/native';
function uniqBy(a, key) {
  if (a === null) {
    return null;
  }
  var seen = {};
  return a.filter(function (item) {
    var k = key(item);
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  });
}
async function loadHistory(setHistory) {
  let history = uniqBy(await getHistory(), JSON.stringify);
  if (history === null) {
    setHistory([]);
  } else {
    if (history != null && history.length > 5) {
      history = history.reverse();
      history.length = 5;
    }
    setHistory(history);
  }
}
export default function RecentlyPlayed() {
  const [history, setHistory] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadHistory(setHistory);
    }, []),
  );
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      {history.map(item => (
        <View key={item.videoId} style={styles.historyItem}>
          <TouchableNativeFeedback
            onPress={() => {
              addSongToQueue(
                item.artist,
                item.title,
                item.videoId,
                `http://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`,
                'song',
                true,
              );
            }}>
            <View style={styles.centeredView}>
              <Image
                source={{
                  uri: `http://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`,
                  //uri: 'http://img.youtube.com/vi/d3clrkLNTSA/mqdefault.jpg',
                }}
                style={styles.itemImage}
              />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
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
  historyItem: {
    marginRight: 10,
    backgroundColor: '#000',
  },
  itemImage: {
    width: 120,
    height: 120,
    opacity: 0.6,
    borderRadius: 5,
  },
  itemTitle: {
    position: 'absolute',
    color: 'white',
    fontSize: 15,
    //fontFamily: 'Product Sans Regular',
  },
});
