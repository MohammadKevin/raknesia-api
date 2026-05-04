import { Module } from '@nestjs/common';
import { DokumenController } from './dokumen.controller';
import { DokumenService } from './dokumen.service';

@Module({
  controllers: [DokumenController],
  providers: [DokumenService]
})
export class DokumenModule {}
