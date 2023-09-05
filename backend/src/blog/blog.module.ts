import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { UserService } from '../user/user.service';

@Module({
  controllers: [BlogController],
  providers: [BlogService, UserService],
})
export class BlogModule {}
