import React from 'react';

interface TrackProps {
  // Define props for track details later, e.g., name, artist, album
  name: string;
  artist: string;
  album: string;
  onAdd?: () => void; // Optional: Function to add track to playlist
  onRemove?: () => void; // Optional: Function to remove track from playlist
  isRemoval?: boolean; // Optional: To determine if the action is removal
}

const Track: React.FC<TrackProps> = ({ name, artist, album, onAdd, onRemove, isRemoval }) => {
  return (
    <div>
      <h3>{name}</h3>
      <p>{artist} | {album}</p>
      {isRemoval ? (
        <button onClick={onRemove}>-</button>
      ) : (
        <button onClick={onAdd}>+</button>
      )}
    </div>
  );
};

export default Track;
