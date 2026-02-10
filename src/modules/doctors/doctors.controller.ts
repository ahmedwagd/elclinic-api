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
import { CreateDoctorDto, UpdateDoctorDto } from './dto';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { PrismaRole } from 'src/common/enums/role.enum';

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

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
}
