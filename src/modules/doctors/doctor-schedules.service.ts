import { Injectable, NotFoundException } from '@nestjs/common';
import { DoctorSchedulesRepository } from './doctor-schedules.repository';
import { CreateDoctorScheduleDto, UpdateDoctorScheduleDto } from './dto';

@Injectable()
export class DoctorSchedulesService {
  constructor(
    private readonly doctorSchedulesRepository: DoctorSchedulesRepository,
  ) {}

  async createSchedule(doctorId: number, dto: CreateDoctorScheduleDto) {
    return await this.doctorSchedulesRepository.create(doctorId, dto);
  }

  async getDoctorSchedules(doctorId: number) {
    return await this.doctorSchedulesRepository.findByDoctorId(doctorId);
  }

  async updateSchedule(id: number, dto: UpdateDoctorScheduleDto) {
    const existing = await this.doctorSchedulesRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Doctor schedule with ID ${id} not found`);
    }
    return await this.doctorSchedulesRepository.update(id, dto);
  }

  async removeSchedule(id: number) {
    const existing = await this.doctorSchedulesRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Doctor schedule with ID ${id} not found`);
    }
    return await this.doctorSchedulesRepository.remove(id);
  }
}
