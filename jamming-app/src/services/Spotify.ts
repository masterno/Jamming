const CLIENT_ID = 'af33bf99442c4150bbe5e3aa559325ca'; // Your Spotify Client ID
const REDIRECT_URI = 'https://jamming-app-noahm.windsurf.build/'; // Your Redirect URI

const Spotify = {
  getAccessToken(): string | undefined {
    // 1. Check for token in sessionStorage
    const tokenFromSession = window.sessionStorage.getItem('spotify_access_token');
    const expiryTimeFromSession = window.sessionStorage.getItem('spotify_token_expiry_time');

    if (tokenFromSession && expiryTimeFromSession && Date.now() < Number(expiryTimeFromSession)) {
      return tokenFromSession;
    }

    // Check if the access token is in the URL
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      const newAccessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      const newExpiryTime = Date.now() + expiresIn * 1000;

      // 2. Store new token and expiry time in sessionStorage
      window.sessionStorage.setItem('spotify_access_token', newAccessToken);
      window.sessionStorage.setItem('spotify_token_expiry_time', String(newExpiryTime));

      // Clear parameters from URL
      window.history.pushState('Access Token', '', '/');
      return newAccessToken;
    } else if (!window.location.href.includes('access_token=')) {
      // Only redirect if there's no token info in URL at all
      // This prevents redirecting if we're on the callback but something else went wrong
      // console.log('No token in URL, redirecting to Spotify for auth...');
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
      window.location.assign(accessUrl); // Use assign to ensure it's a full navigation
    }
    // If we are on the callback URL but parsing failed, or if redirect is pending, return undefined
    // This avoids an immediate redirect loop if parsing fails on the callback.
    return undefined;
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
