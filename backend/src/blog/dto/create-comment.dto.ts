import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  from_user: number;
  to_user: number;
  @IsNotEmpty()
  content: string;
  @IsNumber()
  topic: number;
}
