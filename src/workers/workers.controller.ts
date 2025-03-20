import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UsePipes,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import {
  CreateWorkerDto,
  createWorkerValidationSchema,
} from './dto/create-worker.dto';
import {
  UpdateWorkerDto,
  updateWorkerValidationSchema,
} from './dto/update-worker.dto';
import { WorkerDto } from './dto/worker.dto';
import { Page, PaginatedResponse, Pagination } from 'src/shared/pagination';
import {
  WorkersFilterRequest,
  WorkersFilter,
  WorkersSortRequest,
  WorkersSortFields,
  WorkersSort,
} from './decorators/workers.decorator';
import { ParseUUIDPipe } from '@nestjs/common';
import { ZodValidationPipe } from 'src/shared/pipes/zod-validation.pipe';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createWorkerValidationSchema))
  async create(@Body() createWorkerDto: CreateWorkerDto) {
    return await this.workersService.create(createWorkerDto);
  }

  @Get()
  async findAll(
    @Pagination() page: Page,
    @WorkersFilterRequest() filter: WorkersFilter,
    @WorkersSortRequest(WorkersSortFields) sort: WorkersSort,
  ): Promise<PaginatedResponse<WorkerDto>> {
    return await this.workersService.findAll(page, filter, sort);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe())
    id: string,
  ): Promise<WorkerDto> {
    return await this.workersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(updateWorkerValidationSchema))
    updateWorkerDto: UpdateWorkerDto,
  ) {
    await this.workersService.update(id, updateWorkerDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.workersService.remove(id);
  }
}
