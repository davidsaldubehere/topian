import React from 'react';
import SearchItem from './SearchItem';
import ScrollView from 'react-native';
const SearchList = ({searchItems}) => {
  return searchItems.map(item => {
    if (item.resultType === 'video' || item.resultType === 'song') {
      return (
        <SearchItem
          title={item.title}
          artist={item.artist}
          videoId={item.videoId}
          thumbnail={item.thumbnail}
          resultType={item.resultType}
          key={item.id}
        />
      );
    }
  });
};

export default SearchList;
