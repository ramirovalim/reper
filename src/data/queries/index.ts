import { createUserQuery, getUserByEmailQuery } from './user';

const userQueries = {
  createUser: createUserQuery,
  getUserByEmail: getUserByEmailQuery,
};

export default userQueries;
