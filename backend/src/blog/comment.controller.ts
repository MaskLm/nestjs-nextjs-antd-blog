import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentItem } from './interfaces/commentItem.interface';
import { Public } from 'src/auth/decorator/public-decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentService.create(createCommentDto);
  }

  @Public()
  @Get()
  async findByTopicIdWithAuthorAndAvatar(
    @Query() query: any,
  ): Promise<CommentItem[]> {
    return await this.commentService.findByTopicIdWithAuthorAndAvatar(
      query.topic,
    );
  }
}
