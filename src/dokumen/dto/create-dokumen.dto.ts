import { IsString, IsDateString, MinLength, MaxLength } from 'class-validator';

export class CreateDokumenDto {
  @IsString()
  @MinLength(3)
  nomorDokumen!: string;

  @IsDateString()
  tanggalMasuk!: string;

  @IsDateString()
  tanggalKeluar!: string;

  @IsString()
  @MinLength(2)
  divisi!: string;

  @IsString()
  @MaxLength(150)
  deskripsi!: string;

  @IsString()
  boxId!: string;
}
