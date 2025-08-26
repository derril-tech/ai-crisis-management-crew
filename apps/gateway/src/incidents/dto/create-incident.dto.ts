import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIncidentDto {
  @ApiProperty({ example: 'Customer data breach detected' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'breach' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'high', enum: ['low', 'medium', 'high', 'critical'] })
  @IsEnum(['low', 'medium', 'high', 'critical'])
  @IsOptional()
  severity?: string;

  @ApiProperty({ example: '2024-12-19T10:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  detected_at?: string;
}
