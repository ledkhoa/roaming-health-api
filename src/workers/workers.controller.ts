import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { WorkerDto } from './dto/worker.dto';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  async create(@Body() createWorkerDto: CreateWorkerDto) {
    return await this.workersService.create(createWorkerDto);
  }

  @Get()
  async findAll() {
    return await this.workersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WorkerDto> {
    return await this.workersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWorkerDto: UpdateWorkerDto,
  ) {
    return await this.workersService.update(id, updateWorkerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.workersService.remove(id);
  }
}
