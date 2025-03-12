import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { and, asc, desc, eq, ilike, SQL } from 'drizzle-orm';
import { WorkersTable } from 'src/drizzle/schema';
import { SortDirection } from 'src/shared/sort';

// Filters
export const WorkersFilterRequest = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): WorkersFilter => {
    const request = ctx.switchToHttp().getRequest();
    const firstName = request.query['firstName'];
    const lastName = request.query['lastName'];
    const email = request.query['email'];
    const isActive = request.query['isActive'];

    return {
      firstName,
      lastName,
      email,
      isActive,
    };
  },
);

export function getQueryFilter(filter: WorkersFilter) {
  const { firstName, lastName, email } = filter;

  const filters: SQL[] = [];

  if (firstName) {
    filters.push(ilike(WorkersTable.firstName, `%${firstName}%`));
  }

  if (lastName) {
    filters.push(ilike(WorkersTable.lastName, `%${lastName}%`));
  }

  if (email) {
    filters.push(ilike(WorkersTable.email, `%${email}%`));
  }

  if (filter.isActive !== undefined) {
    filters.push(eq(WorkersTable.isActive, filter.isActive));
  }

  return and(...filters);
}

export type WorkersFilter = {
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean | undefined;
};

// Sorting
export const WorkersSortRequest = createParamDecorator(
  (data: string[], ctx: ExecutionContext): WorkersSort => {
    const request = ctx.switchToHttp().getRequest();
    const sort = request.query['sortBy'];
    const sortOrder = request.query['sortOrder'] === 'desc' ? 'desc' : 'asc';

    const sortParams = sort ? sort.split('&') : [];

    const sortBy: string[] = [];

    sortParams.forEach((param) => {
      if (data.includes(param)) {
        sortBy.push(param);
      }
    });

    return {
      sortBy,
      dir: sortOrder,
    };
  },
);

export function getQuerySort(sort: WorkersSort) {
  const { sortBy, dir } = sort;

  const sortOrder = dir === 'desc' ? desc : asc;

  const orderBy: SQL[] = [];

  if (sortBy.length) {
    sortBy.forEach((field) => {
      switch (field) {
        case 'first':
          orderBy.push(sortOrder(WorkersTable.firstName));
          break;
        case 'last':
          orderBy.push(sortOrder(WorkersTable.lastName));
          break;
        case 'email':
          orderBy.push(sortOrder(WorkersTable.email));
          break;
      }
    });
  } else {
    orderBy.push(sortOrder(WorkersTable.firstName));
    orderBy.push(sortOrder(WorkersTable.lastName));
  }

  return orderBy;
}

export const WorkersSortFields = ['first', 'last', 'email'];

export type WorkersSort = {
  sortBy: string[];
  dir: SortDirection;
};
