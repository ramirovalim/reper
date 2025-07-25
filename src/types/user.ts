export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export type USER_ACTIONS =
  | { type: 'CREATE_USER'; payload: User }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: User };
