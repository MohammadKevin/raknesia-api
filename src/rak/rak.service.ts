import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRakDto } from './dto/create-rak.dto';
import { UpdateRakDto } from './dto/update-rak.dto';

@Injectable()
export class RakService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRakDto) {
    return this.prisma.rak.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.rak.findMany({
      include: {
        boxes: true,
      },
    });
  }

  async findById(id: string) {
    const rak = await this.prisma.rak.findUnique({
      where: { id },
      include: {
        boxes: true,
      },
    });

    if (!rak) {
      throw new NotFoundException('Rak tidak ditemukan');
    }

    return rak;
  }

  async update(id: string, dto: UpdateRakDto) {
    const existing = await this.prisma.rak.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Rak tidak ditemukan');
    }

    return this.prisma.rak.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.rak.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Rak tidak ditemukan');
    }

    const hasBox = await this.prisma.box.findFirst({
      where: { rakId: id },
    });

    if (hasBox) {
      throw new BadRequestException(
        'Rak tidak bisa dihapus karena masih memiliki box',
      );
    }

    await this.prisma.rak.delete({
      where: { id },
    });

    return { message: 'Rak berhasil dihapus' };
  }
}
