import bcrypt from 'bcrypt'
import IUserRepository from '../../repositories/IUserRepository'
import User from '../../domain/User';
import { Roles } from '../../domain/enum'

class RegisterService {

  constructor(readonly repository: IUserRepository) {}
  
  async register(email:string, password:string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email: email,
      roles: [ Roles.CLIENT ],
      password: hashedPassword
    })

    await this.repository.save(user)
  }
  
}

export default RegisterService;