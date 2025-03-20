import {
  CreateWorkerDto,
  createWorkerValidationSchema,
} from './create-worker.dto';

export type UpdateWorkerDto = CreateWorkerDto;

export const updateWorkerValidationSchema = createWorkerValidationSchema;
