import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class FindAllBlogDto {
  @IsNumber()
  @IsNotEmpty()
  current: number;
  @IsNumber()
  @IsNotEmpty()
  pageSize: number;
  @IsOptional()
  filters?: Record<string, any>;
  @IsOptional()
  @IsEnum(['createdAt', 'updatedAt', 'title'])
  sortField: string;
  @IsOptional()
  sortOrder: 'ascend' | 'descend';
}
