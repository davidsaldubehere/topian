import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const SearchItem = props => {
  return (
    <View style={styles.searchItem}>
      <Text style={styles.textBold}>Song: {props.title}</Text>
      <Text style={styles.text}>Artist: {props.artist}</Text>
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
