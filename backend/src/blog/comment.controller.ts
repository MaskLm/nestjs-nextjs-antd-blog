import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentItem } from './interfaces/commentItem.interface';
import { Public } from 'src/auth/decorator/public-decorator';
import { Roles } from 'src/auth/decorator/roles-decorator';
import { RolesGuard } from 'src/auth/guard/role-auth-guard';

@Controller('blog/comment')
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

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.commentService.delete(+id);
  }
}
