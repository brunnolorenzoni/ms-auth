import User from '../../../domain/User';
import IUserRepository from '../../IUserRepository';

export default class UserInMemory implements IUserRepository {

  users: Array<User> = [
    {
      id: '4c158ef4-8a6a-4b93-a4fa-e4d97286c77c',
      email: 'lorenzoni.brunno@gmail.com',
      password: '$2b$10$FJoDARBWCp8owbNarEfuL.qF5lzVoPueZIPxDWLtQMZINMr20T53y',
      roles: [ 2 ],
      refreshToken: null
    }
  ]

  async save (user: User) : Promise<void> {
    this.users.push(user)
  }

  async update (user: User) : Promise<void> {
    const index = this.users.findIndex((u: User) => u.id === user.id)
    this.users[index] = user
  }

  async findByEmail (email: string) : Promise<User | undefined> {
    return this.users.find((u:User) => u.email === email)
  }

  async findByRefreshToken (refreshToken: string) : Promise<User | undefined> {
    return this.users.find((u:User) => u.refreshToken === refreshToken)
  }

}