import React from 'react';
import {Text, View, StyleSheet, TouchableNativeFeedback} from 'react-native';

const SearchItem = ({artist, title}) => {
  return (
    <View style={styles.searchItem}>
      <Text style={styles.textBold}>Song: {title}</Text>
      <Text style={styles.text}>Artist: {artist}</Text>
    </View>
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
