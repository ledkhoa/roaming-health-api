import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkplacesService } from './workplaces.service';
import { CreateWorkplaceDto } from './dto/create-workplace.dto';
import { UpdateWorkplaceDto } from './dto/update-workplace.dto';
import { Page, Pagination } from 'src/shared/pagination';
import {
  WorkplacesFilter,
  WorkplacesFilterRequest,
  WorkplacesSort,
  WorkplacesSortFields,
  WorkplacesSortRequest,
} from './decorators/workplaces.decorator';

@Controller('workplaces')
export class WorkplacesController {
  constructor(private readonly workplacesService: WorkplacesService) {}

  @Post()
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
  async findOne(@Param('id') id: string) {
    return await this.workplacesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWorkplaceDto: UpdateWorkplaceDto,
  ) {
    return await this.workplacesService.update(id, updateWorkplaceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.workplacesService.remove(id);
  }
}
