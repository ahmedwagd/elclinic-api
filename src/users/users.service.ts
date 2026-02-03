import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    return this.excludeUnnecessaryFields(user);
  }
  async findByEmail(email: string) {
    const user = await this.userRepository.findOne(email);
    return this.excludeUnnecessaryFields(user);
  }
  async updateHashedRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
  ) {
    return await this.userRepository.updateHashedRefreshToken(
      userId,
      hashedRefreshToken,
    );
  }
  async findById(userId: string) {
    const user = await this.userRepository.findById(userId);
    return this.excludeUnnecessaryFields(user);
  }
  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.update(userId, updateUserDto);
    return this.excludeUnnecessaryFields(user);
  }
  async delete(userId: string) {
    return await this.userRepository.delete(userId);
  }
  async excludeUnnecessaryFields(user: any) {
    const { password, createdAt, updatedAt, ...result } = user;
    return result;
  }
}
