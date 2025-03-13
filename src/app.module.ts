import { Module } from '@nestjs/common';
import { WorkersModule } from './workers/workers.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { WorkplacesModule } from './workplaces/workplaces.module';

@Module({
  imports: [ConfigModule.forRoot(), WorkersModule, DrizzleModule, WorkplacesModule],
})
export class AppModule {}
