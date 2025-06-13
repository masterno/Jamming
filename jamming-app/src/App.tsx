import { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import Spotify from './services/Spotify';

// Define a simple type for track data for now
interface TrackData {
  id: string;
  name: string;
  artist: string;
  album: string;
  uri: string;
}

function App() {
  const [searchResults, setSearchResults] = useState<TrackData[]>([]);
  const [playlistName, setPlaylistName] = useState<string>('My Awesome Playlist');
  const [playlistTracks, setPlaylistTracks] = useState<TrackData[]>([]);
  // @ts-ignore: Will be used later for API calls
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | undefined>(undefined);

  const performSearch = (term: string) => {
    Spotify.search(term).then(tracks => {
      setSearchResults(tracks);
    });
  };

  useEffect(() => {
    const token = Spotify.getAccessToken();
    setSpotifyAccessToken(token);
    // Note: If token is undefined here, Spotify.getAccessToken() has already initiated a redirect.
    // If token is successfully retrieved, it's stored in Spotify.ts and also here for potential direct use.
  }, []);

  // If we don't have a token yet, and Spotify.getAccessToken() didn't redirect,
  // we might want to show a loading state or a login button.
  // For now, the app will attempt to render, and Spotify.getAccessToken will handle the redirect if needed.


  // Placeholder functions - to be implemented later
  const addTrackToPlaylist = (track: TrackData) => {
    if (!playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      setPlaylistTracks(prevTracks => [...prevTracks, track]);
    }
  };

  const removeTrackFromPlaylist = (track: TrackData) => {
    setPlaylistTracks(prevTracks => prevTracks.filter(savedTrack => savedTrack.id !== track.id));
  };

  const updatePlaylistName = (name: string) => {
    setPlaylistName(name);
  };

  const savePlaylist = () => {
    // This will eventually interact with the Spotify API
    alert(`Playlist "${playlistName}" with ${playlistTracks.length} tracks saved! (Not really, this is a placeholder)`);
  };

  return (
    <div className="App">
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App-playlist">
        <SearchBar onSearch={performSearch} />
        <div className="App-content">
          <SearchResults tracks={searchResults} onAddTrack={addTrackToPlaylist} />
          <Playlist 
            playlistName={playlistName} 
            playlistTracks={playlistTracks} 
            onNameChange={updatePlaylistName} 
            onRemoveTrack={removeTrackFromPlaylist} 
            onSave={savePlaylist} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;
