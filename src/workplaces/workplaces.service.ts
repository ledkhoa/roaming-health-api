import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkplaceDto } from './dto/create-workplace.dto';
import { UpdateWorkplaceDto } from './dto/update-workplace.dto';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { WorkplacesTable } from 'src/drizzle/schema';
import { eq } from 'drizzle-orm';
import { WorkplaceDto } from './dto/workplace.dto';
import {
  getQueryFilter,
  getQuerySort,
  WorkplacesFilter,
  WorkplacesSort,
} from './decorators/workplaces';
import {
  Page,
  PaginatedResponse,
  getQueryPagination,
} from 'src/shared/pagination';

@Injectable()
export class WorkplacesService {
  constructor(private drizzle: DrizzleService) {}

  async create(createWorkplaceDto: CreateWorkplaceDto) {
    return await this.drizzle.db
      .insert(WorkplacesTable)
      .values(createWorkplaceDto)
      .returning({
        id: WorkplacesTable.id,
        name: WorkplacesTable.name,
        address1: WorkplacesTable.address1,
        address2: WorkplacesTable.address2,
        city: WorkplacesTable.city,
        state: WorkplacesTable.state,
        zip: WorkplacesTable.zip,
      });
  }

  async findAll(
    page: Page,
    filter: WorkplacesFilter,
    sort: WorkplacesSort,
  ): Promise<PaginatedResponse<WorkplaceDto>> {
    const queryFilters = getQueryFilter(filter);

    const workplaces = await this.drizzle.db.query.WorkplacesTable.findMany({
      columns: { created_at: false, updated_at: false },
      ...getQueryPagination(page),
      where: () => queryFilters,
      orderBy: () => getQuerySort(sort),
    });

    const total = await this.drizzle.db.$count(WorkplacesTable, queryFilters);

    return {
      data: workplaces,
      total,
    };
  }

  async findOne(id: string): Promise<WorkplaceDto> {
    const workplace = await this.drizzle.db.query.WorkplacesTable.findFirst({
      where: eq(WorkplacesTable.id, id),
    });

    if (!workplace) {
      throw new NotFoundException(`Workplace with id ${id} not found.`);
    }

    return {
      id: workplace.id,
      name: workplace.name,
      address1: workplace.address1,
      address2: workplace.address2,
      city: workplace.city,
      state: workplace.state,
      zip: workplace.zip,
      isActive: workplace.isActive,
    };
  }

  async update(id: string, updateWorkplaceDto: UpdateWorkplaceDto) {
    return await this.drizzle.db
      .update(WorkplacesTable)
      .set({ ...updateWorkplaceDto })
      .where(eq(WorkplacesTable.id, id))
      .returning({
        id: WorkplacesTable.id,
        name: WorkplacesTable.name,
        address1: WorkplacesTable.address1,
        address2: WorkplacesTable.address2,
        city: WorkplacesTable.city,
        state: WorkplacesTable.state,
        zip: WorkplacesTable.zip,
      });
  }

  async remove(id: string) {
    const removed = await this.drizzle.db
      .update(WorkplacesTable)
      .set({ isActive: false })
      .where(eq(WorkplacesTable.id, id));

    if (removed.rowCount === 0) {
      throw new NotFoundException(`Workplace with id ${id} not found.`);
    }
  }
}
