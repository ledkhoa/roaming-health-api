import { WorkerDto } from './worker.dto';

export type CreateWorkerDto = Omit<WorkerDto, 'id'>;
