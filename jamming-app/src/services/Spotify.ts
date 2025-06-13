const CLIENT_ID = 'af33bf99442c4150bbe5e3aa559325ca';
const REDIRECT_URI = 'https://jamming-app-noahm.windsurf.build/';
const SCOPE = 'playlist-modify-public';

// Helper function to generate a random string for the code verifier
const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

// Helper function to hash the code verifier to get the code challenge
const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

// Helper function to base64 encode the hashed code challenge
const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const Spotify = {
  async getAccessToken(): Promise<string> {
    // 1. Check for a valid token in session storage
    const tokenFromSession = window.sessionStorage.getItem('spotify_access_token');
    const expiryTimeFromSession = window.sessionStorage.getItem('spotify_token_expiry_time');

    if (tokenFromSession && expiryTimeFromSession && Date.now() < Number(expiryTimeFromSession)) {
      return tokenFromSession;
    }

    // 2. Check if we are on the redirect URI with an authorization code
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // We have a code, let's exchange it for a token
      const codeVerifier = window.sessionStorage.getItem('spotify_code_verifier');
      if (!codeVerifier) {
        throw new Error('Code verifier not found in session storage.');
      }

      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: codeVerifier,
        }),
      };

      const response = await fetch('https://accounts.spotify.com/api/token', payload);
      if (!response.ok) {
        throw new Error('Failed to fetch access token');
      }
      const { access_token, expires_in } = await response.json();

      // Store the new token and expiry time
      window.sessionStorage.setItem('spotify_access_token', access_token);
      window.sessionStorage.setItem('spotify_token_expiry_time', String(Date.now() + expires_in * 1000));
      
      // Clean the URL and return the token
      window.history.pushState({}, '', '/');
      return access_token;
    } else {
      // 3. No token and no code, so we need to redirect the user to Spotify to log in
      const codeVerifier = generateRandomString(64);
      window.sessionStorage.setItem('spotify_code_verifier', codeVerifier);
      const hashed = await sha256(codeVerifier);
      const codeChallenge = base64encode(hashed);

      const authUrl = new URL('https://accounts.spotify.com/authorize');
      authUrl.search = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: SCOPE,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: REDIRECT_URI,
      }).toString();

      window.location.assign(authUrl);
      // This part of the code will not be reached because of the redirect.
      // We return a promise that never resolves to prevent further execution.
      return new Promise(() => {});
    }
  },

  async search(term: string): Promise<any[]> {
    try {
        const accessToken = await this.getAccessToken(); // Note: this might trigger a redirect

        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Search request failed');
        }

        const jsonResponse = await response.json();
        if (!jsonResponse.tracks) {
          return [];
        }

        return jsonResponse.tracks.items.map((track: any) => {
          const albumImage = track.album && track.album.images && track.album.images.length > 0 
            ? track.album.images[track.album.images.length - 1].url // Default to the last image (often smallest)
            : undefined; // Or a placeholder image URL

          return {
            id: track.id,
            name: track.name,
            artist: track.artists && track.artists.length > 0 ? track.artists[0].name : 'Unknown Artist',
            album: track.album && track.album.name ? track.album.name : 'Unknown Album',
            uri: track.uri,
            image: albumImage,
          };
        }));
    } catch (error) {
        // console.error('Spotify search failed:', error);
        console.error('Spotify search failed:', error);
        return []; // Return an empty array on error
    }
  },

  async savePlaylist(playlistName: string, trackUris: string[]): Promise<void> {
    if (!playlistName || !trackUris.length) {
      console.log('Playlist name or tracks are empty. Aborting save.');
      return;
    }

    try {
      const accessToken = await this.getAccessToken();
      const headers = { 
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };

      // 1. Get current user's ID
      const userResponse = await fetch('https://api.spotify.com/v1/me', { headers: { Authorization: `Bearer ${accessToken}` } });
      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user data: ${await userResponse.text()}`);
      }
      const userData = await userResponse.json();
      const userId = userData.id;

      // 2. Create a new playlist
      const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ name: playlistName }),
      });
      if (!playlistResponse.ok) {
        throw new Error(`Failed to create playlist: ${await playlistResponse.text()}`);
      }
      const playlistData = await playlistResponse.json();
      const playlistId = playlistData.id;

      // 3. Add tracks to the new playlist
      const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ uris: trackUris }),
      });

      if (!addTracksResponse.ok) {
        throw new Error(`Failed to add tracks to playlist: ${await addTracksResponse.text()}`);
      }
      console.log('Playlist saved successfully!');

    } catch (error) {
      console.error('Error saving playlist to Spotify:', error);
    }
  },
};

export default Spotify;
