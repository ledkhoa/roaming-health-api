import { createParamDecorator, ExecutionContext } from '@nestjs/common';

function parseOptionalInt(defaultValue: number, value?: string): number {
  return value ? parseInt(value, 10) : defaultValue;
}

export const Pagination = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Page => {
    const request = ctx.switchToHttp().getRequest();
    const take = parseOptionalInt(10, request.query['take']);
    const skip = parseOptionalInt(0, request.query['skip']);

    return { take, skip };
  },
);

export function getQueryPagination(page: Page) {
  return {
    limit: page.take,
    offset: page.skip * page.take,
  };
}

export type Page = {
  skip: number;
  take: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
};
