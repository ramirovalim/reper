const authUrl = 'https://accounts.spotify.com/api';
const baseUrl = 'https://api.spotify.com/v1';

// AUTH
export const getRefreshTokenEndpoint = () => {
  return `${authUrl}/token`;
};

// TRACKS
export const getRecentlyPlayedEndpoint = () => {
  return `${baseUrl}/me/player/recently-played`;
};

export const getTrackEndpoint = (trackId: string) => {
  return `${baseUrl}/tracks/${trackId}`;
};


