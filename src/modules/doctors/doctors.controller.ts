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
import { DoctorsService } from './doctors.service';
import { DoctorSchedulesService } from './doctor-schedules.service';
import {
  CreateDoctorDto,
  UpdateDoctorDto,
  CreateDoctorScheduleDto,
  UpdateDoctorScheduleDto,
} from './dto';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { PrismaRole } from 'src/common/enums/role.enum';

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorsController {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly doctorSchedulesService: DoctorSchedulesService,
  ) {}

  @Post()
  @Roles(PrismaRole.ADMIN)
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    const doctor = await this.doctorsService.create(createDoctorDto);
    return {
      message: 'Doctor created successfully',
      data: doctor,
    };
  }

  @Get()
  @Roles(PrismaRole.ADMIN)
  async findAll(
    @Query('skip', new ParseIntPipe({ optional: true })) skip?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    const doctors = await this.doctorsService.findAll({ skip, take });
    const result = {
      message: 'Doctors retrieved successfully',
      data: doctors,
    };
    return result;
  }

  @Get(':id')
  @Roles(PrismaRole.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const doctor = await this.doctorsService.findOne(id);
    return {
      message: 'Doctor retrieved successfully',
      data: doctor,
    };
  }

  @Patch(':id')
  @Roles(PrismaRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    const doctor = await this.doctorsService.update(id, updateDoctorDto);
    return {
      message: 'Doctor updated successfully',
      data: doctor,
    };
  }

  @Delete(':id')
  @Roles(PrismaRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.doctorsService.remove(id);
    return {
      message: 'Doctor deleted successfully',
    };
  }

  @Post(':id/schedules')
  @Roles(PrismaRole.ADMIN, PrismaRole.DOCTOR)
  async createSchedule(
    @Param('id', ParseIntPipe) doctorId: number,
    @Body() dto: CreateDoctorScheduleDto,
  ) {
    const schedule = await this.doctorSchedulesService.createSchedule(
      doctorId,
      dto,
    );
    return {
      message: 'Doctor schedule created successfully',
      data: schedule,
    };
  }

  @Get(':id/schedules')
  @Roles(PrismaRole.ADMIN, PrismaRole.DOCTOR, PrismaRole.RECEPTIONIST)
  async getDoctorSchedules(@Param('id', ParseIntPipe) doctorId: number) {
    const schedules = await this.doctorSchedulesService.getDoctorSchedules(
      doctorId,
    );
    return {
      message: 'Doctor schedules retrieved successfully',
      data: schedules,
    };
  }

  @Patch('schedules/:scheduleId')
  @Roles(PrismaRole.ADMIN, PrismaRole.DOCTOR)
  async updateSchedule(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Body() dto: UpdateDoctorScheduleDto,
  ) {
    const schedule = await this.doctorSchedulesService.updateSchedule(
      scheduleId,
      dto,
    );
    return {
      message: 'Doctor schedule updated successfully',
      data: schedule,
    };
  }

  @Delete('schedules/:scheduleId')
  @Roles(PrismaRole.ADMIN)
  async removeSchedule(@Param('scheduleId', ParseIntPipe) scheduleId: number) {
    await this.doctorSchedulesService.removeSchedule(scheduleId);
    return {
      message: 'Doctor schedule deleted successfully',
    };
  }
}
