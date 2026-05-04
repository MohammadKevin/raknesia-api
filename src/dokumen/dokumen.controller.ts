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

  // ✅ CREATE
  @Post()
  create(@Body() dto: CreateDokumenDto, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.dokumenService.create(dto, req.user.id);
  }

  // ✅ GET ALL (per user)
  @Get()
  findAll(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.dokumenService.findAll(req.user.id);
  }

  // ✅ GET BY ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dokumenService.findById(id);
  }

  // ✅ UPDATE
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDokumenDto) {
    return this.dokumenService.update(id, dto);
  }

  // ✅ DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dokumenService.remove(id);
  }

  // ✅ UPLOAD FILE
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('File tidak ditemukan');
    }

    const fileUrl = `/uploads/${file.filename}`;

    return this.dokumenService.updateFile(id, fileUrl);
  }
}
