import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { CreateDoctorScheduleDto, UpdateDoctorScheduleDto } from './dto';

@Injectable()
export class DoctorSchedulesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(doctorId: number, data: CreateDoctorScheduleDto) {
    return await this.prisma.doctorSchedule.create({
      data: {
        doctorId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });
  }

  async findByDoctorId(doctorId: number) {
    return await this.prisma.doctorSchedule.findMany({
      where: { doctorId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async findById(id: number) {
    return await this.prisma.doctorSchedule.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdateDoctorScheduleDto) {
    return await this.prisma.doctorSchedule.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.doctorSchedule.delete({
      where: { id },
    });
  }
}
