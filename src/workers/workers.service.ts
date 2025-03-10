import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { workers } from 'src/drizzle/schema';
import { eq } from 'drizzle-orm';
import { WorkerDto } from './dto/worker.dto';

@Injectable()
export class WorkersService {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(createWorkerDto: CreateWorkerDto) {
    return await this.drizzle.db
      .insert(workers)
      .values(createWorkerDto)
      .returning({
        id: workers.id,
        firstName: workers.firstName,
        lastName: workers.lastName,
        email: workers.email,
      });
  }

  async findAll() {
    return null;
  }

  async findOne(id: string): Promise<WorkerDto> {
    const worker = await this.drizzle.db.query.workers.findFirst({
      where: eq(workers.id, id),
    });

    if (!worker) {
      throw new NotFoundException(`Worker with id ${id} not found.`);
    }

    return {
      id: worker.id,
      firstName: worker.firstName,
      lastName: worker.lastName,
      email: worker.email,
    };
  }

  async update(id: string, updateWorkerDto: UpdateWorkerDto) {
    return await this.drizzle.db
      .update(workers)
      .set({ ...updateWorkerDto })
      .where(eq(workers.id, id))
      .returning({
        id: workers.id,
        firstName: workers.firstName,
        lastName: workers.lastName,
        email: workers.email,
      });
  }

  async remove(id: string) {
    await this.drizzle.db
      .update(workers)
      .set({ isActive: false })
      .where(eq(workers.id, id));
  }
}
