import { Module } from '@nestjs/common';
import { WorkersModule } from './workers/workers.module';

@Module({
  imports: [WorkersModule],
})
export class AppModule {}
