import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { DokumenService } from './dokumen.service';
import { CreateDokumenDto } from './dto/create-dokumen.dto';
import { UpdateDokumenDto } from './dto/update-dokumen.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Dokumen')
@Controller('dokumen')
export class DokumenController {
  constructor(private readonly dokumenService: DokumenService) {}

  @Post()
  async create(@Body() dto: CreateDokumenDto, @Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user?.userId || 'dummy-user-id';
    return this.dokumenService.create(dto, userId);
  }

  @Get()
  async findAll() {
    return this.dokumenService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.dokumenService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDokumenDto) {
    return this.dokumenService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.dokumenService.remove(id);
  }

  @Post(':id/upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes('pdf')) {
          return cb(new Error('Hanya file PDF yang diperbolehkan'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileUrl = `/uploads/${file.filename}`;
    return this.dokumenService.updateFile(id, fileUrl);
  }
}
