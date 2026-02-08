import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { PatientsRepository } from './patients.repository';

@Module({
  providers: [PatientsService, PatientsRepository],
  controllers: [PatientsController],
})
export class PatientsModule {}
