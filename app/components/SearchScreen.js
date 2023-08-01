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
  StatusBar,
  Platform,
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
import NavBar from './NavBar';
import LottieView from 'lottie-react-native';
import GlobalMusicPlayer from './GlobalMusicPlayer';
import SearchDropdown from './SearchDropdown';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SearchScreen = ({navigation, trackTitle, setTrackTitle}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchItems, setSearchItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;
  return (
    <SafeAreaView style={{...styles.container, marginTop: statusBarHeight}}>
      <View style={styles.top}>
        <NavBar navigation={navigation} />
        <View style={styles.search}>
          <TextInput
            style={styles.input}
            placeholder="Search for anything..."
            keyboardType="ascii-capable"
            selectionColor={'white'}
            onChangeText={setSearchText}
            placeholderTextColor={'grey'}
          />
          <Icon.Button
            name="search1"
            size={30}
            backgroundColor="transparent"
            onPress={() => {
              setShowFilterDropdown(!showFilterDropdown);
            }}
          />
        </View>
        <View style={styles.searchList}>
          {showFilterDropdown === true && (
            <SearchDropdown
              searchText={searchText}
              setSearchItems={setSearchItems}
              setIsLoading={setIsLoading}></SearchDropdown>
          )}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always">
            <SearchList searchItems={searchItems} navigation={navigation} />
          </ScrollView>
        </View>
        {isLoading === true && (
          <LottieView
            source={require('../../assets/loading3.json')}
            autoPlay
            loop
            style={styles.loadingAnimation}
          />
        )}
      </View>
      <GlobalMusicPlayer navigation={navigation} target={'bottom'} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#121212',
    backgroundColor: 'rgba(0,0,0,0.7)',

    justifyContent: 'flex-end',
    color: 'white',
  },
  searchList: {
    alignContent: 'center',
    width: '90%',
    maxHeight: '23%',
  },

  text: {
    color: 'white',
    margin: 30,
    fontWeight: 'bold',
    fontSize: 17,
    maxWidth: '40%',
    //fontFamily: 'Product Sans Regular',
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
    backgroundColor: '#212121',
    height: 40,
    margin: 12,
    borderWidth: 0,
    padding: 10,
    color: 'white',
    width: '80%',
    borderColor: 'white',
    borderRadius: 12,
  },
  loadingAnimation: {
    width: 100,
    height: 200,
  },
});
export default SearchScreen;
