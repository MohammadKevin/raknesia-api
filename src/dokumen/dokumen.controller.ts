import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DokumenService } from './dokumen.service';
import { CreateDokumenDto } from './dto/create-dokumen.dto';
import { UpdateDokumenDto } from './dto/update-dokumen.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Express } from 'express';

// 🔥 typing user biar aman
interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

@Controller('dokumen')
@UseGuards(JwtAuthGuard)
export class DokumenController {
  constructor(private readonly dokumenService: DokumenService) {}

  // ================= CREATE =================
  @Post()
  create(@Body() dto: CreateDokumenDto, @Req() req: AuthRequest) {
    return this.dokumenService.create(dto, req.user.id);
  }

  // ================= GET ALL =================
  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.dokumenService.findAll(req.user.id);
  }

  // ================= GET BY ID =================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dokumenService.findById(id);
  }

  // ================= UPDATE =================
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDokumenDto) {
    return this.dokumenService.update(id, dto);
  }

  // ================= DELETE =================
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dokumenService.remove(id);
  }

  // ================= UPLOAD FILE =================
  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads', // 🔥 pastikan folder ada
      limits: {
        fileSize: 5 * 1024 * 1024, // max 5MB
      },
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
