import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto, UpdatePatientDto } from './dto';
import { PatientsRepository } from './patients.repository';

@Injectable()
export class PatientsService {
  constructor(private readonly patientsRepository: PatientsRepository) {}

  async create(createPatientDto: CreatePatientDto) {
    try {
      const existingPatient = await this.patientsRepository.findByPhoneNumber(
        createPatientDto.phone,
      );

      if (existingPatient) {
        return existingPatient;
      }
      return await this.patientsRepository.create(createPatientDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(params: { skip?: number; take?: number }) {
    return await this.patientsRepository.findAll(params);
  }

  async findOne(id: number) {
    const patient = await this.patientsRepository.findById(id);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    const patient = await this.patientsRepository.findById(id);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return await this.patientsRepository.update(id, updatePatientDto);
  }

  async remove(id: number) {
    const patient = await this.patientsRepository.findById(id);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return await this.patientsRepository.remove(id);
  }
}
