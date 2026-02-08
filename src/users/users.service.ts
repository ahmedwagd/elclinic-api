import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserDto: CreateUserDto) {
    // hash password argon2
    createUserDto.password = await argon2.hash(createUserDto.password);
    const user = await this.userRepository.create(createUserDto);
    return user;
  }
  async findAll({ skip, take }: { skip?: number; take?: number }) {
    const users = await this.userRepository.findAll({ skip, take });
    return users;
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
    // hash password argon2
    if (updateUserDto.password) {
      updateUserDto.password = await argon2.hash(updateUserDto.password);
    }
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
  async getUserPassword(userId: string) {
    const user = await this.userRepository.getUserPassword(userId);
    return user?.password;
  }
  async updateHashedPassword(userId: string, hashedPassword: string) {
    await this.userRepository.updateHashedPassword(userId, hashedPassword);
  }
}
