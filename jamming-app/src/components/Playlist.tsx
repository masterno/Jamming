import React from 'react';
import TrackList from './TrackList';
import type { TrackData } from '../types';

interface PlaylistProps {
  playlistName: string;
  playlistTracks: TrackData[];
  onNameChange: (name: string) => void;
  onRemove: (track: TrackData) => void;
  onSave: () => void;
}

const Playlist: React.FC<PlaylistProps> = ({ playlistName, playlistTracks, onNameChange, onRemove, onSave }) => {
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(event.target.value);
  };

  return (
    <div>
      <input value={playlistName} onChange={handleNameChange} />
      <TrackList tracks={playlistTracks} onRemove={onRemove} isRemoval={true} />
      <button onClick={onSave}>SAVE TO SPOTIFY</button>
    </div>
  );
};

export default Playlist;
