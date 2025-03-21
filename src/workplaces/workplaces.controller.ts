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
  ParseUUIDPipe,
} from '@nestjs/common';
import { WorkplacesService } from './workplaces.service';
import {
  CreateWorkplaceDto,
  createWorkplaceValidationSchema,
} from './dto/create-workplace.dto';
import {
  updatedWorkplaceValidationSchema,
  UpdateWorkplaceDto,
} from './dto/update-workplace.dto';
import { Page, Pagination } from 'src/shared/pagination';
import {
  WorkplacesFilter,
  WorkplacesFilterRequest,
  WorkplacesSort,
  WorkplacesSortFields,
  WorkplacesSortRequest,
} from './decorators/workplaces.decorator';
import { ZodValidationPipe } from 'src/shared/pipes/zod-validation.pipe';

@Controller('workplaces')
export class WorkplacesController {
  constructor(private readonly workplacesService: WorkplacesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createWorkplaceValidationSchema))
  async create(@Body() createWorkplaceDto: CreateWorkplaceDto) {
    return await this.workplacesService.create(createWorkplaceDto);
  }

  @Get()
  async findAll(
    @Pagination() page: Page,
    @WorkplacesFilterRequest() filter: WorkplacesFilter,
    @WorkplacesSortRequest(WorkplacesSortFields) sort: WorkplacesSort,
  ) {
    return await this.workplacesService.findAll(page, filter, sort);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.workplacesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(updatedWorkplaceValidationSchema))
    updateWorkplaceDto: UpdateWorkplaceDto,
  ) {
    await this.workplacesService.update(id, updateWorkplaceDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.workplacesService.remove(id);
  }
}
