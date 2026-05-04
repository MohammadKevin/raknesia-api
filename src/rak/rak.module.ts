import { Module } from '@nestjs/common';
import { RakController } from './rak.controller';
import { RakService } from './rak.service';

@Module({
  controllers: [RakController],
  providers: [RakService],
  exports: [RakService],
})
export class RakModule {}
