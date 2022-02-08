import React from 'react';
import SearchItem from './SearchItem';
const SearchList = ({searchItems}) => {
  return searchItems.map(item => (
    <SearchItem
      title={item.title}
      artist={item.artist}
      videoId={item.videoId}
      key={item.id}
    />
  ));
};

export default SearchList;
