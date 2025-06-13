const CLIENT_ID = 'af33bf99442c4150bbe5e3aa559325ca'; // Your Spotify Client ID
const REDIRECT_URI = 'https://jamming-app-noahm.windsurf.build/'; // Your Redirect URI

let accessToken: string | undefined;

const Spotify = {
  getAccessToken(): string | undefined {
    if (accessToken) {
      return accessToken;
    }

    // Check if the access token is in the URL
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // Clear parameters from URL, so the app doesn't try to grab token again
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', '', '/'); // Clears the URL
      return accessToken;
    } else {
      // Redirect user to Spotify authorization
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
      window.location.href = accessUrl;
    }
    return undefined; // Should not be reached if redirect happens
  },

  search(term: string): Promise<any[]> {
    const accessToken = Spotify.getAccessToken();
    if (!accessToken) {
      console.error('Access token is missing!');
      return Promise.resolve([]);
    }

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`Request failed with status ${response.status}`);
    })
    .then(jsonResponse => {
      if (!jsonResponse || !jsonResponse.tracks || !jsonResponse.tracks.items) {
        return [];
      }
      return jsonResponse.tracks.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artists && track.artists.length > 0 ? track.artists[0].name : 'Unknown Artist',
        album: track.album && track.album.name ? track.album.name : 'Unknown Album',
        uri: track.uri
      }));
    })
    .catch(error => {
      console.error('Spotify search API error:', error);
      return []; 
    });
  }
};

export default Spotify;
