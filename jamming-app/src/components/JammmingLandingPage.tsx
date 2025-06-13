"use client";

import { useState, useEffect, useCallback } from "react";
import Spotify from '@/services/Spotify';
import type { TrackData } from '@/types';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Search, Save, Plus, Music, MinusCircle } from "lucide-react";
import { motion } from "framer-motion";

export interface JammmingLandingPageProps {
  className?: string;
}

export default function JammmingLandingPage({
  // Props for className will be kept, other props might be added later if needed
  // All main app logic and state will reside here for now.
  className
}: JammmingLandingPageProps) {
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<TrackData[]>([]);
  const [playlistName, setPlaylistName] = useState<string>('My New Playlist'); // Initial name, can be updated by user
  const [playlistTracks, setPlaylistTracks] = useState<TrackData[]>([]);

  // State from the new design for UI interactions
  const [searchQuery, setSearchQuery] = useState(""); 
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const initializeAuth = useCallback(() => {
    const initAuth = async () => {
      try {
        // getAccessToken will handle redirect or return existing token from session storage
        const token = await Spotify.getAccessToken();
        // If getAccessToken completes without redirecting and returns a token (it might return void or a promise that never resolves if it redirects)
        if (token && typeof token === 'string') { 
          setSpotifyAccessToken(token);
        }
        // If getAccessToken redirects, this part of the code might not be reached immediately,
        // or the component might unmount/remount.
      } catch (error) {
        console.error("Error during initial auth in JammmingLandingPage:", error);
        // Optionally, handle error, e.g., by setting an error state or logging out
      }
    };

    // Only attempt to get token if it's not already set from a previous render or redirect.
    // Spotify.getAccessToken() itself checks session storage, so this !spotifyAccessToken check
    // is mainly to prevent re-running the async logic if the token is already in our React state.
    if (!spotifyAccessToken) { 
        initAuth();
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleLogin = () => {
    Spotify.getAccessToken(); // This will redirect to Spotify if no token and not in URL hash
  };

  const performSearch = useCallback(async (term: string) => {
    if (!spotifyAccessToken) {
      console.error("Search cannot be performed without an access token. Please log in.");
      // Optionally, prompt user to log in or show a message
      // We could also automatically trigger handleLogin() here if desired
      return;
    }
    if (!term) {
      setSearchResults([]); // Clear results if search term is empty
      return;
    }
    try {
      const tracks = await Spotify.search(term);
      setSearchResults(tracks);
    } catch (error) {
      console.error("Error during search:", error);
      setSearchResults([]); // Clear results on error
    }
  }, [spotifyAccessToken]);

  const addTrackToPlaylist = (trackToAdd: TrackData) => {
    setPlaylistTracks(prevTracks => {
      if (prevTracks.find(track => track.id === trackToAdd.id)) {
        return prevTracks; // Track already in playlist, do nothing
      }
      return [...prevTracks, trackToAdd];
    });
  };

  const removeTrackFromPlaylist = (trackToRemove: TrackData) => {
    setPlaylistTracks(prevTracks => 
      prevTracks.filter(track => track.id !== trackToRemove.id)
    );
  };

  const handleSavePlaylist = async () => {
    if (!playlistName || playlistTracks.length === 0) {
      alert("Please add a name and some tracks to your playlist.");
      return;
    }
    const trackUris = playlistTracks.map(track => track.uri);
    try {
      await Spotify.savePlaylist(playlistName, trackUris);
      alert('Playlist saved successfully to Spotify!');
      setPlaylistName('New Playlist'); // Reset playlist name
      setPlaylistTracks([]); // Clear the playlist in the UI
    } catch (error) {
      console.error('Failed to save playlist:', error);
      alert('Failed to save playlist. See console for details.');
    }
  };

  // Sample data has been removed and will be replaced by actual state logic.
  const fadeInUp = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      duration: 0.6
    }
  };
  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  return <div className={cn("min-h-screen bg-gradient-to-br from-white via-green-50/30 to-white", className)}>
      {/* Header */}
      <header className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center flex-1 tracking-tight" initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.5
        }}>
            Jammming
          </motion.h1>
          
          <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }}>
            <Button onClick={handleLogin} className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-medium px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200" aria-label="Login with Spotify">
              <Music className="w-4 h-4 mr-2" />
              <span>Login with Spotify</span>
            </Button>
          </motion.div>
        </div>
      </header>

      <main className="w-full">
        {/* Hero Section */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight" {...fadeInUp}>
              Build Spotify playlists in seconds.
            </motion.h2>
            
            <motion.p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }}>
              Search, drag, and save your favorite tracks.
            </motion.p>

            <motion.div className="max-w-2xl mx-auto" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.4
          }}>
              <div className={cn("flex gap-3 p-2 bg-white rounded-2xl shadow-lg transition-all duration-300", isSearchFocused && "shadow-2xl ring-4 ring-[#1DB954]/20 scale-[1.02]")}>
                <Input type="text" placeholder="Search for songs, artists, or albums" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)} className="flex-1 border-0 text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0" aria-label="Search for music" />
                <Button onClick={() => performSearch(searchQuery)} className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200" aria-label="Search">
                  <Search className="w-5 h-5 mr-2" />
                  <span>SEARCH</span>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Preview */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8" variants={staggerChildren} initial="initial" whileInView="animate" viewport={{
            once: true
          }}>
              {/* Search Results Card */}
              <motion.article variants={fadeInUp}>
                <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <Search className="w-6 h-6 mr-3 text-[#1DB954]" />
                      Search Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {searchResults.length === 0 && searchQuery && (
                      <p className="text-gray-500 text-center">No results found. Try a different search!</p>
                    )}
                    {searchResults.length === 0 && !searchQuery && (
                      <p className="text-gray-500 text-center">Search for music to see results here.</p>
                    )}
                    {searchResults.map(track => (
                      <div key={track.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                        <img 
                          src={track.image || 'https://via.placeholder.com/64?text=No+Art'} 
                          alt={`${track.album} album cover`} 
                          className="w-12 h-12 rounded-lg object-cover shadow-md" 
                          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/64?text=No+Art')} // Fallback for broken image links
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{track.name}</h4>
                          <p className="text-sm text-gray-600 truncate">{track.artist}</p>
                        </div>
                        <Button onClick={() => addTrackToPlaylist(track)} size="sm" className="bg-[#1DB954] hover:bg-[#1ed760] text-white rounded-full px-4 shadow-md hover:shadow-lg transition-all duration-200" aria-label={`Add ${track.name} to playlist`}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.article>

              {/* Your Playlist Card */}
              <motion.article variants={fadeInUp}>
                <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <Music className="w-6 h-6 mr-3 text-[#1DB954]" />
                      Your Playlist
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label htmlFor="playlist-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Playlist Name
                      </label>
                      <Input id="playlist-name" type="text" value={playlistName} onChange={e => setPlaylistName(e.target.value)} className="w-full text-lg font-semibold border-2 border-gray-200 focus:border-[#1DB954] rounded-xl" aria-label="Playlist name" />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3 mt-4 pr-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                      {playlistTracks.length > 0 ? playlistTracks.map((track, i) => (
                        <div 
                          key={track.id} 
                          className="flex items-center justify-between p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <img src={track.image || `https://picsum.photos/seed/playlist${i}/40`} alt={track.album || 'Album art'} className="w-10 h-10 rounded-md object-cover" />
                            <div className="overflow-hidden">
                              <h4 className="font-semibold text-gray-900 truncate">{track.name}</h4>
                              <p className="text-sm text-gray-600 truncate">{track.artist}</p>
                          </div>
                        </div>
                        <Button onClick={() => removeTrackFromPlaylist(track)} variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full" aria-label={`Remove ${track.name} from playlist`}>
                          <MinusCircle className="w-5 h-5" />
                        </Button>
                      </div>
                    )) : (
                      <p className="text-center text-gray-500 py-4">Your playlist is empty. Add some tracks!</p>
                    )}
                  </div> {/* End of scrollable playlist items div */}

                  <Button onClick={handleSavePlaylist} className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200" aria-label="Save playlist to Spotify">
                    <Save className="w-5 h-5 mr-2" />
                    Save to Spotify
                  </Button>
                </CardContent>
              </Card>
            </motion.article> {/* End of Playlist motion.article */}
          </motion.div> {/* End of motion.div that wraps BOTH Search Results and Playlist cards */}
        </div> {/* End of div className="grid grid-cols-1 lg:grid-cols-2 gap-8" */}
      </section>
        {/* How It Works Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50/50">
          <div className="max-w-6xl mx-auto">
            <motion.h3 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              How It Works
            </motion.h3>
            
            <motion.ol className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={staggerChildren} initial="initial" whileInView="animate" viewport={{
            once: true
          }}>
              <motion.li variants={fadeInUp} className="text-center">
                <div className="w-20 h-20 bg-[#1DB954] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Login with Spotify</h4>
                <p className="text-gray-600 leading-relaxed">Connect your Spotify account to access your music library and save playlists.</p>
              </motion.li>
              
              <motion.li variants={fadeInUp} className="text-center">
                <div className="w-20 h-20 bg-[#1DB954] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Search & Add Tracks</h4>
                <p className="text-gray-600 leading-relaxed">Find your favorite songs, artists, and albums, then add them to your playlist.</p>
              </motion.li>
              
              <motion.li variants={fadeInUp} className="text-center">
                <div className="w-20 h-20 bg-[#1DB954] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Save className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Save Playlist</h4>
                <p className="text-gray-600 leading-relaxed">Save your curated playlist directly to your Spotify account with one click.</p>
              </motion.li>
            </motion.ol>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p className="text-gray-600 text-lg" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            Made with ❤️ using Spotify API.
          </motion.p>
        </div>
      </footer>
    </div>;
}
