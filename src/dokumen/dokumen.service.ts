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

  // ================= CREATE =================
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
        nomorDokumen: dto.nomorDokumen,
        tanggalMasuk: new Date(dto.tanggalMasuk),
        tanggalKeluar: dto.tanggalKeluar ? new Date(dto.tanggalKeluar) : null, // 🔥 FIX
        divisi: dto.divisi,
        deskripsi: dto.deskripsi,
        boxId: dto.boxId,
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

  // ================= FIND ALL =================
  async findAll(userId: string) {
    return this.prisma.dokumen.findMany({
      where: {
        createdById: userId,
      },
      include: {
        box: {
          include: {
            rak: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // ================= FIND BY ID =================
  async findById(id: string) {
    const dokumen = await this.prisma.dokumen.findUnique({
      where: { id },
      include: {
        box: {
          include: {
            rak: true,
          },
        },
      },
    });

    if (!dokumen) {
      throw new NotFoundException('Dokumen tidak ditemukan');
    }

    return dokumen;
  }

  // ================= UPDATE =================
  async update(id: string, dto: UpdateDokumenDto) {
    const dokumen = await this.prisma.dokumen.findUnique({
      where: { id },
    });

    if (!dokumen) {
      throw new NotFoundException('Dokumen tidak ditemukan');
    }

    // cek nomorDokumen unik
    if (dto.nomorDokumen) {
      const existing = await this.prisma.dokumen.findUnique({
        where: { nomorDokumen: dto.nomorDokumen },
      });

      if (existing && existing.id !== id) {
        throw new BadRequestException('Nomor dokumen sudah digunakan');
      }
    }

    // cek box valid
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
      data: {
        ...(dto.nomorDokumen && { nomorDokumen: dto.nomorDokumen }),
        ...(dto.tanggalMasuk && {
          tanggalMasuk: new Date(dto.tanggalMasuk),
        }),

        // 🔥 FIX PALING PENTING
        ...(dto.tanggalKeluar !== undefined && {
          tanggalKeluar: dto.tanggalKeluar ? new Date(dto.tanggalKeluar) : null,
        }),

        ...(dto.divisi && { divisi: dto.divisi }),
        ...(dto.deskripsi && { deskripsi: dto.deskripsi }),
        ...(dto.boxId && { boxId: dto.boxId }),
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

  // ================= DELETE =================
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

  // ================= UPDATE FILE =================
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
