import { WorkerDto } from './worker.dto';
import { z } from 'zod';
export type CreateWorkerDto = Omit<WorkerDto, 'id' | 'isActive'>;

export const createWorkerValidationSchema = z.object({
  firstName: z.string().max(255),
  lastName: z.string().max(255),
  email: z.string().email().max(255),
});
