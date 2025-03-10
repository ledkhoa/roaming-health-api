import { Module } from '@nestjs/common';
import { WorkersModule } from './workers/workers.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), WorkersModule, DrizzleModule],
})
export class AppModule {}
