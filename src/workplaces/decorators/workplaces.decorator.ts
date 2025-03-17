import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { and, asc, desc, eq, ilike, SQL } from 'drizzle-orm';
import { WorkplacesTable } from 'src/drizzle/schema';
import { SortDirection } from 'src/shared/sort';

// Filters
export const WorkplacesFilterRequest = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): WorkplacesFilter => {
    const request = ctx.switchToHttp().getRequest();
    const name = request.query['name'];
    const city = request.query['city'];
    const state = request.query['state'];
    const isActive = request.query['isActive'];

    return {
      name,
      city,
      state,
      isActive,
    };
  },
);

export function getQueryFilter({
  name,
  city,
  state,
  isActive,
}: WorkplacesFilter) {
  const filters: SQL[] = [];

  if (name) {
    filters.push(ilike(WorkplacesTable.name, `%${name}%`));
  }

  if (city) {
    filters.push(ilike(WorkplacesTable.city, `%${city}%`));
  }

  if (state) {
    filters.push(ilike(WorkplacesTable.state, `%${state}%`));
  }

  if (isActive !== undefined) {
    filters.push(eq(WorkplacesTable.isActive, isActive));
  }

  return and(...filters);
}

export type WorkplacesFilter = {
  name: string;
  city: string;
  state: string;
  isActive: boolean | undefined;
};

// Sorting
export const WorkplacesSortRequest = createParamDecorator(
  (data: string[], ctx: ExecutionContext): WorkplacesSort => {
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

export function getQuerySort({ sortBy, dir }: WorkplacesSort) {
  const sortOrder = dir === 'desc' ? desc : asc;

  const orderBy: SQL[] = [];

  if (sortBy.length) {
    sortBy.forEach((field) => {
      switch (field) {
        case 'name':
          orderBy.push(sortOrder(WorkplacesTable.name));
          break;
        case 'city':
          orderBy.push(sortOrder(WorkplacesTable.city));
          break;
        case 'state':
          orderBy.push(sortOrder(WorkplacesTable.state));
          break;
      }
    });
  } else {
    orderBy.push(sortOrder(WorkplacesTable.name));
  }

  return orderBy;
}

export const WorkplacesSortFields = ['name', 'city', 'state'];

export type WorkplacesSort = {
  sortBy: string[];
  dir: SortDirection;
};
