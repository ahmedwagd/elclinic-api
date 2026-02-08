import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaRole } from 'src/common/enums/role.enum';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }
  // make params optional
  async findAll({ skip, take }: { skip?: number; take?: number }) {
    return await this.prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        doctorProfile: true,
        patientProfile: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  async findById(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        hashedRefreshToken: true,
      },
    });
  }
  async findOne(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });
  }
  async update(userId: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }
  async delete(userId: string) {
    return await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
  async updateHashedRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
  ) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }
  async updateUserRole(userId: string, role: PrismaRole) {}

  async assignDoctorProfile(userId: string, doctorProfileId: number) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: PrismaRole.DOCTOR,
        doctorProfile: {
          connect: {
            id: doctorProfileId,
          },
        },
      },
    });
  }
  async assignPatientProfile(userId: string, patientProfileId: number) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: PrismaRole.PATIENT,
        patientProfile: {
          connect: {
            id: patientProfileId,
          },
        },
      },
    });
  }
  async getUserPassword(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });
  }
  async updateHashedPassword(userId: string, hashedPassword: string) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
  }
}
