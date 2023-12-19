export class PaginationBlogDto {
  current: number;
  pageSize: number;
  filters?: Record<string, any>;
}
