import { WorkplaceDto } from './workplace.dto';
import { z } from 'zod';

export type CreateWorkplaceDto = Omit<WorkplaceDto, 'id'>;

export const createWorkplaceValidationSchema = z.object({
  name: z.string().max(255),
  address1: z.string().max(255),
  address2: z.string().max(128).optional(),
  city: z.string().max(128),
  state: z.string().max(13),
  zip: z.string().max(5),
  isActive: z.boolean(),
});
