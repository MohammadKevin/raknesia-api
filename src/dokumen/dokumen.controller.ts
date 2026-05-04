import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DokumenService } from './dokumen.service';
import { CreateDokumenDto } from './dto/create-dokumen.dto';
import { UpdateDokumenDto } from './dto/update-dokumen.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('dokumen')
@UseGuards(JwtAuthGuard)
export class DokumenController {
  constructor(private readonly dokumenService: DokumenService) {}

  @Post()
  create(@Body() dto: CreateDokumenDto, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.dokumenService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.dokumenService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dokumenService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDokumenDto) {
    return this.dokumenService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dokumenService.remove(id);
  }

  // 🔥 UPLOAD FILE (FIXED)
  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads', // pastikan folder ada
    }),
  )
  uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan');
    }

    const fileUrl = `/uploads/${file.filename}`;

    return this.dokumenService.updateFile(id, fileUrl);
  }
}
