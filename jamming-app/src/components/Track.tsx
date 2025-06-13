import React from 'react';

import type { TrackData } from '../types';

interface TrackProps {
  track: TrackData;
  onAdd?: (track: TrackData) => void;
  onRemove?: (track: TrackData) => void;
  isRemoval?: boolean;
}

const Track: React.FC<TrackProps> = ({ track, onAdd, onRemove, isRemoval }) => {
  const addTrack = () => {
    if (onAdd) {
      onAdd(track);
    }
  };

  const removeTrack = () => {
    if (onRemove) {
      onRemove(track);
    }
  };

  return (
    <div>
      <h3>{track.name}</h3>
      <p>{track.artist} | {track.album}</p>
      {isRemoval ? (
        <button onClick={removeTrack}>-</button>
      ) : (
        <button onClick={addTrack}>+</button>
      )}
    </div>
  );
};

export default Track;
