import { PartialType } from '@nestjs/mapped-types';
import { CreateRakDto } from './create-rak.dto';

export class UpdateRakDto extends PartialType(CreateRakDto) {}
