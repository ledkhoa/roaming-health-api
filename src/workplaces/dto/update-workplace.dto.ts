import {
  CreateWorkplaceDto,
  createWorkplaceValidationSchema,
} from './create-workplace.dto';

export type UpdateWorkplaceDto = CreateWorkplaceDto;

export const updatedWorkplaceValidationSchema = createWorkplaceValidationSchema;
