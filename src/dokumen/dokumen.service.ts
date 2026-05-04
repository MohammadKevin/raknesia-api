import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDokumenDto } from './dto/create-dokumen.dto';
import { UpdateDokumenDto } from './dto/update-dokumen.dto';

@Injectable()
export class DokumenService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDokumenDto, userId: string) {
    const existing = await this.prisma.dokumen.findUnique({
      where: { nomorDokumen: dto.nomorDokumen },
    });

    if (existing) {
      throw new BadRequestException('Nomor dokumen sudah digunakan');
    }

    const box = await this.prisma.box.findUnique({
      where: { id: dto.boxId },
    });

    if (!box) {
      throw new NotFoundException('Box tidak ditemukan');
    }

    return this.prisma.dokumen.create({
      data: {
        ...dto,
        createdById: userId,
      },
      include: {
        box: {
          include: {
            rak: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.dokumen.findMany({
      include: {
        box: {
          include: {
            rak: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    const dokumen = await this.prisma.dokumen.findUnique({
      where: { id },
      include: {
        box: {
          include: {
            rak: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!dokumen) {
      throw new NotFoundException('Dokumen tidak ditemukan');
    }

    return dokumen;
  }

  async update(id: string, dto: UpdateDokumenDto) {
    const dokumen = await this.prisma.dokumen.findUnique({
      where: { id },
    });

    if (!dokumen) {
      throw new NotFoundException('Dokumen tidak ditemukan');
    }

    if (dto.nomorDokumen) {
      const existing = await this.prisma.dokumen.findUnique({
        where: { nomorDokumen: dto.nomorDokumen },
      });

      if (existing && existing.id !== id) {
        throw new BadRequestException('Nomor dokumen sudah digunakan');
      }
    }

    if (dto.boxId) {
      const box = await this.prisma.box.findUnique({
        where: { id: dto.boxId },
      });

      if (!box) {
        throw new NotFoundException('Box tidak ditemukan');
      }
    }

    return this.prisma.dokumen.update({
      where: { id },
      data: dto,
      include: {
        box: {
          include: {
            rak: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const dokumen = await this.prisma.dokumen.findUnique({
      where: { id },
    });

    if (!dokumen) {
      throw new NotFoundException('Dokumen tidak ditemukan');
    }

    await this.prisma.dokumen.delete({
      where: { id },
    });

    return { message: 'Dokumen berhasil dihapus' };
  }

  async updateFile(id: string, fileUrl: string) {
    const dokumen = await this.prisma.dokumen.findUnique({
      where: { id },
    });

    if (!dokumen) {
      throw new NotFoundException('Dokumen tidak ditemukan');
    }

    return this.prisma.dokumen.update({
      where: { id },
      data: { fileUrl },
    });
  }
}
