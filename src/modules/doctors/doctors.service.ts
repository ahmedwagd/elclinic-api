import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto, UpdateDoctorDto } from './dto';
import { DoctorsRepository } from './doctors.repository';

@Injectable()
export class DoctorsService {
  constructor(private readonly doctorsRepository: DoctorsRepository) {}

  async create(createDoctorDto: CreateDoctorDto) {
    return await this.doctorsRepository.create(createDoctorDto);
  }

  async findAll(params: { skip?: number; take?: number }) {
    return await this.doctorsRepository.findAll(params);
  }

  async findOne(id: number) {
    const doctor = await this.doctorsRepository.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.doctorsRepository.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return await this.doctorsRepository.update(id, updateDoctorDto);
  }

  async remove(id: number) {
    const doctor = await this.doctorsRepository.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return await this.doctorsRepository.remove(id);
  }
}
