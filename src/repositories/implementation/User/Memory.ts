import User from '../../../domain/User';
import IUserRepository from '../../IUserRepository';

export default class UserInMemory implements IUserRepository {

  users: Array<User> = [
    {
      refreshToken: null,
      id: '9fe7bee3-ac4d-47ee-b5c6-6f17036eae46',
      email: 'lorenzoni.brunno@gmail.com',
      password: '$2b$10$4CxqMFBQXD6U8JZwCHtBreACDqvxnU8vJBoHrYQIUbmSnVGYE4.Fu',
      roles: [ 2 ]
    }
  ]

  async save (user: User) : Promise<void> {
    this.users.push(user)
  }

  async update (user: User) : Promise<void> {
    const index = this.users.findIndex((u: User) => u.id === user.id)
    this.users[index] = user
  }

  async findById (id: string) : Promise<User | undefined> {
    return this.users.find((u:User) => u.id === id)
  }

  async findByEmail (email: string) : Promise<User | undefined> {
    return this.users.find((u:User) => u.email === email)
  }

  async findByRefreshToken (refreshToken: string) : Promise<User | undefined> {
    return this.users.find((u:User) => u.refreshToken === refreshToken)
  }

}