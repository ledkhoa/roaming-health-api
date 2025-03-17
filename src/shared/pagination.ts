import { createParamDecorator, ExecutionContext } from '@nestjs/common';

function parseOptionalInt({
  value,
  defaultValue,
}: {
  value?: string;
  defaultValue: number;
}): number {
  return value ? parseInt(value, 10) : defaultValue;
}

export const Pagination = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Page => {
    const request = ctx.switchToHttp().getRequest();

    const take = parseOptionalInt({
      value: request.query['take'],
      defaultValue: 10,
    });
    const page = parseOptionalInt({
      value: request.query['page'],
      defaultValue: 1,
    });

    return { take, page };
  },
);

export function getQueryPagination(page: Page) {
  const currentPage = page.page > 0 ? page.page - 1 : 0;

  return {
    limit: page.take,
    offset: currentPage * page.take,
  };
}

export type Page = {
  page: number;
  take: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
};
