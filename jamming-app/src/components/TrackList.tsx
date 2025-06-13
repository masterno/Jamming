import React from 'react';
import Track from './Track';

interface TrackData {
  id: string;
  name: string;
  artist: string;
  album: string;
  uri: string; // Spotify track URI
}

interface TrackListProps {
  tracks: TrackData[];
  onAdd?: (track: TrackData) => void;
  onRemove?: (track: TrackData) => void;
  isRemoval?: boolean;
}

const TrackList: React.FC<TrackListProps> = ({ tracks, onAdd, onRemove, isRemoval }) => {
  return (
    <div>
      {tracks.map(track => (
        <Track 
          key={track.id} 
          name={track.name} 
          artist={track.artist} 
          album={track.album} 
          onAdd={onAdd ? () => onAdd(track) : undefined}
          onRemove={onRemove ? () => onRemove(track) : undefined}
          isRemoval={isRemoval}
        />
      ))}
    </div>
  );
};

export default TrackList;
