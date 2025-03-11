import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { and, ilike } from 'drizzle-orm';
import { WorkersTable } from 'src/drizzle/schema';

export const WorkersRequest = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): WorkersFilter => {
    const request = ctx.switchToHttp().getRequest();
    const firstName = request.query['firstName'];
    const lastName = request.query['lastName'];
    const email = request.query['email'];

    return {
      firstName,
      lastName,
      email,
    };
  },
);

export function getQueryFilter(filter: WorkersFilter) {
  const { firstName, lastName, email } = filter;

  const filters: any = [];

  if (firstName) {
    filters.push(ilike(WorkersTable.firstName, `%${firstName}%`));
  }

  if (lastName) {
    filters.push(ilike(WorkersTable.lastName, `%${lastName}%`));
  }

  if (email) {
    filters.push(ilike(WorkersTable.email, `%${email}%`));
  }

  return filters;
}

export type WorkersFilter = {
  firstName: string;
  lastName: string;
  email: string;
};
