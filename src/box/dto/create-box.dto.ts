import { IsString, MinLength } from 'class-validator';

export class CreateBoxDto {
  @IsString()
  @MinLength(2)
  kodeBox!: string;

  @IsString()
  rakId!: string;
}
