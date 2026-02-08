import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PrismaGender } from 'src/common/enums';

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsEnum(PrismaGender)
  gender?: PrismaGender;

  @IsOptional()
  @IsString()
  socialId?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
