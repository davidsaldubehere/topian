import React from 'react';
import SearchItem from './SearchItem';
import ScrollView from 'react-native';
const SearchList = ({searchItems}) => {
  return searchItems.map(item => (
    <SearchItem
      title={item.title}
      artist={item.artist}
      videoId={item.videoId}
      thumbnail={item.thumbnail}
      key={item.id}
    />
  ));
};

export default SearchList;
