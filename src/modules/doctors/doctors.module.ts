import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DoctorsRepository } from './doctors.repository';
import { DoctorSchedulesRepository } from './doctor-schedules.repository';
import { DoctorSchedulesService } from './doctor-schedules.service';

@Module({
  providers: [
    DoctorsService,
    DoctorsRepository,
    DoctorSchedulesRepository,
    DoctorSchedulesService,
  ],
  controllers: [DoctorsController],
})
export class DoctorsModule {}
