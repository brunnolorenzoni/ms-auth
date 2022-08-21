import User from "../domain/User";

export default interface IUserRepository {
  save: (user: User) => Promise<void>;
  update: (user: User) => Promise<void>;
  findById: (id: string) => Promise<User | undefined>;
  findByEmail: (email: string) => Promise<User | undefined>;
  findByRefreshToken: (refreshToken: string) => Promise<User | undefined>;
}