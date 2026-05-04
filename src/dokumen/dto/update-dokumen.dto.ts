import { PartialType } from '@nestjs/mapped-types';
import { CreateDokumenDto } from './create-dokumen.dto';

export class UpdateDokumenDto extends PartialType(CreateDokumenDto) {}
