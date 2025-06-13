import React from 'react';
import Track from './Track';
import type { TrackData } from '../types';

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
          track={track}
          onAdd={onAdd}
          onRemove={onRemove}
          isRemoval={isRemoval}
        />
      ))}
    </div>
  );
};

export default TrackList;
