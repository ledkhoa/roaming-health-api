import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { WorkersTable } from 'src/drizzle/schema';
import { eq } from 'drizzle-orm';
import { WorkerDto } from './dto/worker.dto';
import {
  getQueryPagination,
  Page,
  PaginatedResponse,
} from 'src/shared/pagination';
import {
  getQueryFilter,
  getQuerySort,
  WorkersFilter,
  WorkersSort,
} from './decorators/workers';

@Injectable()
export class WorkersService {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(createWorkerDto: CreateWorkerDto) {
    return await this.drizzle.db
      .insert(WorkersTable)
      .values(createWorkerDto)
      .returning({
        id: WorkersTable.id,
        firstName: WorkersTable.firstName,
        lastName: WorkersTable.lastName,
        email: WorkersTable.email,
      });
  }

  async findAll(
    page: Page,
    filter: WorkersFilter,
    sort: WorkersSort,
  ): Promise<PaginatedResponse<WorkerDto>> {
    const queryFilters = getQueryFilter(filter);

    const workers = await this.drizzle.db.query.WorkersTable.findMany({
      columns: { created_at: false, updated_at: false },
      ...getQueryPagination(page),
      where: () => queryFilters,
      orderBy: () => getQuerySort(sort),
    });

    const total = await this.drizzle.db.$count(WorkersTable, queryFilters);

    return {
      data: workers,
      total,
    };
  }

  async findOne(id: string): Promise<WorkerDto> {
    const worker = await this.drizzle.db.query.WorkersTable.findFirst({
      where: eq(WorkersTable.id, id),
    });

    if (!worker) {
      throw new NotFoundException(`Worker with id ${id} not found.`);
    }

    return {
      id: worker.id,
      firstName: worker.firstName,
      lastName: worker.lastName,
      email: worker.email,
      isActive: worker.isActive,
    };
  }

  async update(id: string, updateWorkerDto: UpdateWorkerDto) {
    return await this.drizzle.db
      .update(WorkersTable)
      .set({ ...updateWorkerDto })
      .where(eq(WorkersTable.id, id))
      .returning({
        id: WorkersTable.id,
        firstName: WorkersTable.firstName,
        lastName: WorkersTable.lastName,
        email: WorkersTable.email,
        isActive: WorkersTable.isActive,
      });
  }

  async remove(id: string) {
    await this.drizzle.db
      .update(WorkersTable)
      .set({ isActive: false })
      .where(eq(WorkersTable.id, id));
  }
}
