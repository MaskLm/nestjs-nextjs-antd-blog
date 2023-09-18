import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [BlogController],
  imports: [UserModule],
  providers: [BlogService],
})
export class BlogModule {}
