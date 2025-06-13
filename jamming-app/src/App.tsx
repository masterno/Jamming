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
  
  // Dummy search results for now
  const handleSearch = (term: string) => {
    console.log(`Searching for: ${term}`); // Placeholder for actual search logic
    // Simulate API call
    setSearchResults([
      { id: '1', name: 'Song A', artist: 'Artist X', album: 'Album P', uri: 'spotify:track:123' },
      { id: '2', name: 'Song B', artist: 'Artist Y', album: 'Album Q', uri: 'spotify:track:456' },
      { id: '3', name: 'Song C', artist: 'Artist Z', album: 'Album R', uri: 'spotify:track:789' },
    ]);
  };

  return (
    <div className="App">
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App-playlist">
        <SearchBar onSearch={handleSearch} />
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
