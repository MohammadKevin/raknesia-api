import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';

@Injectable()
export class BoxService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBoxDto) {
    const rak = await this.prisma.rak.findUnique({
      where: { id: dto.rakId },
    });

    if (!rak) {
      throw new NotFoundException('Rak tidak ditemukan');
    }

    const existing = await this.prisma.box.findUnique({
      where: { kodeBox: dto.kodeBox },
    });

    if (existing) {
      throw new BadRequestException('Kode box sudah digunakan');
    }

    return this.prisma.box.create({
      data: {
        kodeBox: dto.kodeBox,
        rakId: dto.rakId,
      },
      include: {
        rak: true,
      },
    });
  }

  async findAll() {
    return this.prisma.box.findMany({
      include: {
        rak: true,
      },
    });
  }

  async findById(id: string) {
    const box = await this.prisma.box.findUnique({
      where: { id },
      include: {
        rak: true,
      },
    });

    if (!box) {
      throw new NotFoundException('Box tidak ditemukan');
    }

    return box;
  }

  async update(id: string, dto: UpdateBoxDto) {
    const box = await this.prisma.box.findUnique({
      where: { id },
    });

    if (!box) {
      throw new NotFoundException('Box tidak ditemukan');
    }

    if (dto.rakId) {
      const rak = await this.prisma.rak.findUnique({
        where: { id: dto.rakId },
      });

      if (!rak) {
        throw new NotFoundException('Rak tidak ditemukan');
      }
    }

    if (dto.kodeBox) {
      const existing = await this.prisma.box.findUnique({
        where: { kodeBox: dto.kodeBox },
      });

      if (existing && existing.id !== id) {
        throw new BadRequestException('Kode box sudah digunakan');
      }
    }

    return this.prisma.box.update({
      where: { id },
      data: dto,
      include: {
        rak: true,
      },
    });
  }

  async remove(id: string) {
    const box = await this.prisma.box.findUnique({
      where: { id },
    });

    if (!box) {
      throw new NotFoundException('Box tidak ditemukan');
    }

    const hasDokumen = await this.prisma.dokumen.findFirst({
      where: { boxId: id },
    });

    if (hasDokumen) {
      throw new BadRequestException(
        'Box tidak bisa dihapus karena masih memiliki dokumen',
      );
    }

    await this.prisma.box.delete({
      where: { id },
    });

    return { message: 'Box berhasil dihapus' };
  }
}
