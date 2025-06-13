import { useState, useEffect } from 'react';

import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import Spotify from './services/Spotify';
import type { TrackData } from './types';
import { Button } from "@/components/ui/button";

function App() {
  const [searchResults, setSearchResults] = useState<TrackData[]>([]);
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [playlistTracks, setPlaylistTracks] = useState<TrackData[]>([]);
  // @ts-ignore: Will be used later for API calls
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | undefined>(undefined);

  const performSearch = async (term: string) => {
    try {
      const results = await Spotify.search(term);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  useEffect(() => {
    // On component mount, try to get the access token.
    // This will handle the redirect flow.
    const initializeAuth = async () => {
      try {
        const token = await Spotify.getAccessToken();
        // @ts-ignore
        setSpotifyAccessToken(token);
      } catch (error) {
        console.error('Authentication failed:', error);
      }
    };
    initializeAuth();
  }, []);

  // If we don't have a token yet, and Spotify.getAccessToken() didn't redirect,
  // we might want to show a loading state or a login button.
  // For now, the app will attempt to render, and Spotify.getAccessToken will handle the redirect if needed.


  // Placeholder functions - to be implemented later
  const addTrack = (track: TrackData) => {
    if (playlistTracks.some(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    setPlaylistTracks(prevTracks => [...prevTracks, track]);
  };

  const removeTrack = (track: TrackData) => {
    setPlaylistTracks(prevTracks => prevTracks.filter(currentTrack => currentTrack.id !== track.id));
  };

  const updatePlaylistName = (name: string) => {
    setPlaylistName(name);
  };

  const savePlaylist = async () => {
    const trackUris = playlistTracks.map(track => track.uri);
    await Spotify.savePlaylist(playlistName, trackUris);
    // Reset the playlist in the app after saving
    setPlaylistName('New Playlist');
    setPlaylistTracks([]);
    alert('Playlist saved successfully to Spotify!');
  };

  return (
    <div className="App p-8 bg-gray-900 text-white min-h-screen"> {/* Example Tailwind classes */}
      <h1 className="text-5xl font-bold mb-8 text-center text-purple-400">Ja<span className="text-green-400">mmm</span>ing</h1> {/* Example Tailwind classes */}
      <div className="text-center mb-8">
        <Button variant="secondary" size="lg">ShadCN Test Button</Button>
      </div>
      <div className="App-playlist">
        <SearchBar onSearch={performSearch} />
        <div className="App-content">
          <SearchResults searchResults={searchResults} onAdd={addTrack} />
          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
