import { AccessToken } from '@spotify/web-api-ts-sdk';
import { useSession } from 'next-auth/react';

export const useSpotifyToken = (): AccessToken => {
  const session = useSession();

  if (!session.data) {
    throw new Error('Sessão não encontrada?');
  }
  const {
    accessToken: access_token,
    refreshToken: refresh_token,
    expires,
  } = session.data;

  const token = {
    access_token,
    token_type: 'Bearer',
    expires_in: Number(expires),
    refresh_token,
  };

  return token;
};
