import { spotifyClient } from './client';
import { getRecentlyPlayedEndpoint, getTrackEndpoint } from './endpoints';

const spotifyEndpoints = {
  getRecentlyPlayedEndpoint,
  getTrackEndpoint,
};

export { spotifyClient, spotifyEndpoints };
