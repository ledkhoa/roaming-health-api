import { Injectable } from '@nestjs/common';
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

  async findOne(id: string): Promise<WorkerDto | null> {
    const worker = await this.drizzle.db
      .select()
      .from(workers)
      .where(eq(workers.id, id));

    if (!worker || worker.length !== 1) {
      console.log('Worker not found');
      return null;
    }

    return {
      id: worker[0].id,
      firstName: worker[0].firstName,
      lastName: worker[0].lastName,
      email: worker[0].email,
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
