import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import IUserRepository from '../../repositories/IUserRepository'
import User from '../../domain/User'


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
      { expiresIn: '30s' }
    );
  }

  generateRefreshToken(id: string) {
    return jwt.sign(
      { "id": id },
      this.refresh_token_secret,
      { expiresIn: '24h' }
    );
  }
  
  async login(email:string, password:string): Promise<{ accessToken:string, refreshToken:string }> {
    const user = await this.repository.findByEmail(email) as unknown as User
    if(!user) throw new Error('Wrong credentials')
    const passwordCompared = await bcrypt.compare(password, user.password);
    if(!passwordCompared) throw new Error('Wrong credentials')

    const accessToken = this.generateAcessToken(user)
    const refreshToken = this.generateRefreshToken(user.id)
    
    user.refreshToken = refreshToken
    await this.repository.update(user)

    return ({ accessToken, refreshToken })
  }

  async refresh (token: string) : Promise<{ accessToken:string, refreshToken:string }> {
    const user = await this.repository.findByRefreshToken(token)
    if (!user) throw new Error('Token invalid')

    try {
      jwt.verify(token, this.refresh_token_secret)

      const accessToken = this.generateAcessToken(user)
      const refreshToken = this.generateRefreshToken(user.id)

      user.refreshToken = refreshToken
      await this.repository.update(user)

      return { accessToken, refreshToken }
    } catch (e: any) {
      throw e.message
    }

  }

  async verify (token: string) : Promise<string | jwt.JwtPayload> {
    try {
      const tokenVerifaction = jwt.verify(token, this.acess_token_secret);
      return tokenVerifaction
    } catch (e: any) {
      throw e.message
    }
  }

  async logout (refreshToken: string) : Promise<void> {
    console.log('Logout', refreshToken)
  }
  
}

export default AuthService;