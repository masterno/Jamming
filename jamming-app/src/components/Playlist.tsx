import React from 'react';
import TrackList from './TrackList';

interface TrackData {
  id: string;
  name: string;
  artist: string;
  album: string;
  uri: string;
}

interface PlaylistProps {
  playlistName: string;
  playlistTracks: TrackData[];
  onNameChange: (newName: string) => void;
  onRemoveTrack: (track: TrackData) => void;
  onSave: () => void;
}

const Playlist: React.FC<PlaylistProps> = ({ playlistName, playlistTracks, onNameChange, onRemoveTrack, onSave }) => {
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(event.target.value);
  };

  return (
    <div>
      <input value={playlistName} onChange={handleNameChange} />
      <TrackList tracks={playlistTracks} onRemove={onRemoveTrack} isRemoval={true} />
      <button onClick={onSave}>SAVE TO SPOTIFY</button>
    </div>
  );
};

export default Playlist;
