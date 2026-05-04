import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { RakService } from './rak.service';
import { CreateRakDto } from './dto/create-rak.dto';
import { UpdateRakDto } from './dto/update-rak.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Rak')
@Controller('rak')
export class RakController {
  constructor(private readonly rakService: RakService) {}

  @Post()
  create(@Body() dto: CreateRakDto) {
    return this.rakService.create(dto);
  }

  @Get()
  findAll() {
    return this.rakService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.rakService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRakDto) {
    return this.rakService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rakService.remove(id);
  }
}
