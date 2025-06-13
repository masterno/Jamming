import React from 'react';
import TrackList from './TrackList';
import type { TrackData } from '../types';

interface SearchResultsProps {
  searchResults: TrackData[];
  onAdd: (track: TrackData) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchResults, onAdd }) => {
  return (
    <div>
      <h2>Results</h2>
      <TrackList tracks={searchResults} onAdd={onAdd} isRemoval={false} />
    </div>
  );
};

export default SearchResults;
