import { Module } from '@nestjs/common';
import { WorkplacesService } from './workplaces.service';
import { WorkplacesController } from './workplaces.controller';

@Module({
  controllers: [WorkplacesController],
  providers: [WorkplacesService],
})
export class WorkplacesModule {}
