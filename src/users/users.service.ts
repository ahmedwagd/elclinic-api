import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    return user;
  }
  async findByEmail(email: string) {
    const user = await this.userRepository.findOne(email);

    try {
      return user;
    } catch (error) {
      return null;
    }
  }
  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne(email);
  }
  async updateHashedRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
  ) {
    const user = await this.userRepository.updateHashedRefreshToken(
      userId,
      hashedRefreshToken,
    );
    return user;
  }
  async findById(userId: string) {
    const user = await this.userRepository.findById(userId);
    return user;
  }
  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.update(userId, updateUserDto);
    return user;
  }
  async delete(userId: string) {
    const user = await this.userRepository.delete(userId);
    return user;
  }
  // async excludeUnnecessaryFields(user: any) {
  //   const { password, createdAt, updatedAt, ...result } = user;
  //   return result;
  // }
}
