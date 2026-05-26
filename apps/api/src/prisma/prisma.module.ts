import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
