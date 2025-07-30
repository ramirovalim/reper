import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export interface SpotifyContextType {
  client: SpotifyApi | unknown;
}
