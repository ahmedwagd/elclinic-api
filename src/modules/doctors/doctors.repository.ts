import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto';

@Injectable()
export class DoctorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDoctorDto) {
    return await this.prisma.doctor.create({
      data,
    });
  }

  async findAll({ skip, take }: { skip?: number; take?: number }) {
    return await this.prisma.doctor.findMany({
      skip,
      take,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    return await this.prisma.doctor.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdateDoctorDto) {
    return await this.prisma.doctor.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.doctor.delete({
      where: { id },
    });
  }
}
