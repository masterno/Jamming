import React from 'react';
import TrackList from './TrackList';

interface TrackData {
  id: string;
  name: string;
  artist: string;
  album: string;
  uri: string;
}

interface SearchResultsProps {
  tracks: TrackData[];
  onAddTrack: (track: TrackData) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ tracks, onAddTrack }) => {
  return (
    <div>
      <h2>Results</h2>
      <TrackList tracks={tracks} onAdd={onAddTrack} isRemoval={false} />
    </div>
  );
};

export default SearchResults;
