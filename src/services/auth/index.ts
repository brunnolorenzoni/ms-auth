import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import IUserRepository from '../../repositories/IUserRepository'
import User from '../../domain/User'
import { UnauthorizedError } from '../../api/helpers/ApiError'


class AuthService {
  acess_token_secret: string = process.env.ACCESS_TOKEN_SECRET!;
  refresh_token_secret: string = process.env.REFRESH_TOKEN_SECRET!;
  
  constructor(readonly repository: IUserRepository) {}

  generateAcessToken(user: User) {
    return jwt.sign(
      {
        "user": {
          "id": user.id,
          "email": user.email,
          "roles": user.roles
        }
      },
      this.acess_token_secret,
      { expiresIn: '1h', subject: user.id }
    );
  }

  generateRefreshToken(user: User) {
    return jwt.sign(
      {
        "user": {
          "id": user.id,
          "email": user.email,
          "roles": user.roles
        }
      },
      this.refresh_token_secret,
      { expiresIn: '24h', subject: user.id }
    );
  }
  
  async login(email:string, password:string): Promise<{ accessToken:string, refreshToken:string }> {
    const user = await this.repository.findByEmail(email) as unknown as User
    if(!user) throw new UnauthorizedError('Wrong credentials')
    const passwordCompared = await bcrypt.compare(password, user.password);
    if(!passwordCompared) throw new UnauthorizedError('Wrong credentials')

    const accessToken = this.generateAcessToken(user)
    const refreshToken = this.generateRefreshToken(user)
    
    user.refreshToken = refreshToken
    await this.repository.update(user)

    return ({ accessToken, refreshToken })
  }

  async refresh (accessToken: string, refreshToken: string) : Promise<string> {
    const user = await this.repository.findByRefreshToken(refreshToken)
    if (!user) throw new UnauthorizedError('Token invalid')

    try {
      jwt.verify(refreshToken, this.refresh_token_secret)
      const newAccessToken = this.generateAcessToken(user)
      return newAccessToken
    } catch (e: any) {
      throw new UnauthorizedError(e.message)
    }

  }

  async verify (accessToken: string, refreshToken: string) : Promise<boolean> {
    try {
      const decodedAccessToken = jwt.verify(accessToken, this.acess_token_secret) as { user: User}
      const decodedRefreshToken = jwt.verify(refreshToken, this.refresh_token_secret) as { user: User}

      if(decodedAccessToken.user.id !== decodedRefreshToken.user.id) throw new UnauthorizedError('Tokens not match')
      
      const user = await this.repository.findById(decodedRefreshToken.user.id)
      if (!user || user.refreshToken != refreshToken) throw new UnauthorizedError('Token not match with user')

      return true

    } catch (e: any) {
      throw new UnauthorizedError(e.message)
    }
  }

  async logout (refreshToken: string) : Promise<void> {
    const user = await this.repository.findByRefreshToken(refreshToken)
    if (!user) throw new UnauthorizedError('Token invalid')

    user.refreshToken = null
    await this.repository.update(user)
  }
  
}

export default AuthService;