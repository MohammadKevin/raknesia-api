import { IsString, MinLength } from 'class-validator';

export class CreateRakDto {
  @IsString()
  @MinLength(2)
  namaRak!: string;

  @IsString()
  @MinLength(2)
  lokasi!: string;
}
