import { WorkplaceDto } from './workplace.dto';

export type CreateWorkplaceDto = Omit<WorkplaceDto, 'id'>;
