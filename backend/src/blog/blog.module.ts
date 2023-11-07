import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { UserModule } from '../user/user.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  controllers: [BlogController, CommentController],
  imports: [UserModule],
  providers: [BlogService, CommentService],
})
export class BlogModule {}
