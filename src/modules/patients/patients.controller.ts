import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto } from './dto';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { PrismaRole } from 'src/common/enums/role.enum';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles(PrismaRole.ADMIN, PrismaRole.RECEPTIONIST, PrismaRole.DOCTOR)
  async create(@Body() createPatientDto: CreatePatientDto) {
    const patient = await this.patientsService.create(createPatientDto);
    return {
      message: 'Patient created successfully',
      data: patient,
    };
  }

  @Get()
  @Roles(PrismaRole.ADMIN, PrismaRole.RECEPTIONIST, PrismaRole.DOCTOR)
  async findAll(
    @Query('skip', new ParseIntPipe({ optional: true })) skip?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    const patients = await this.patientsService.findAll({ skip, take });
    return {
      message: 'Patients retrieved successfully',
      data: patients,
    };
  }

  @Get(':id')
  @Roles(PrismaRole.ADMIN, PrismaRole.RECEPTIONIST, PrismaRole.DOCTOR)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const patient = await this.patientsService.findOne(id);
    return {
      message: 'Patient retrieved successfully',
      data: patient,
    };
  }

  @Patch(':id')
  @Roles(PrismaRole.ADMIN, PrismaRole.RECEPTIONIST)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    const patient = await this.patientsService.update(id, updatePatientDto);
    return {
      message: 'Patient updated successfully',
      data: patient,
    };
  }

  @Delete(':id')
  @Roles(PrismaRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.patientsService.remove(id);
    return {
      message: 'Patient deleted successfully',
    };
  }
}
