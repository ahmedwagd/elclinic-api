import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { CreatePatientDto, UpdatePatientDto } from './dto';

@Injectable()
export class PatientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePatientDto) {
    return await this.prisma.patient.create({
      data,
    });
  }

  async findAll({ skip, take }: { skip?: number; take?: number }) {
    return await this.prisma.patient.findMany({
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
    return await this.prisma.patient.findUnique({
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
    return await this.prisma.patient.findUnique({
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

  async update(id: number, data: UpdatePatientDto) {
    return await this.prisma.patient.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.patient.delete({
      where: { id },
    });
  }
}
