import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { BoxService } from './box.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Box')
@Controller('box')
export class BoxController {
  constructor(private readonly boxService: BoxService) {}

  @Post()
  create(@Body() dto: CreateBoxDto) {
    return this.boxService.create(dto);
  }

  @Get()
  findAll() {
    return this.boxService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.boxService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBoxDto) {
    return this.boxService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boxService.remove(id);
  }
}
