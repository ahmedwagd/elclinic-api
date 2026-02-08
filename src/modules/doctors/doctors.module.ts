import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DoctorsRepository } from './doctors.repository';

@Module({
  providers: [DoctorsService, DoctorsRepository],
  controllers: [DoctorsController],
})
export class DoctorsModule {}
