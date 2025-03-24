import { Repository } from 'typeorm';
import { User } from '../entity/user';
import { ObjectId } from 'mongodb';

export class AuthService {
  constructor(private userRepository: Repository<User>) {}

  async validateUser(userName: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { userName } });
    
    if (!user) {
      return null;
    }

    // const isValid = await bcrypt.compare(password, user.password);
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { _id: new ObjectId(id) } });
  }
}
