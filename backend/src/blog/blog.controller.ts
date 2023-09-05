import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Roles } from '../auth/decorator/roles-decorator';
import { RolesGuard } from '../auth/guard/role-auth-guard';
import { PaginationBlogDto } from './dto/pagination-blog.dto';
import { Public } from '../auth/decorator/public-decorator';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createBlogDto: CreateBlogDto) {
    return await this.blogService.create(createBlogDto);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.blogService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return await this.blogService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }

  @Public()
  @Post('pagination')
  async pagination(@Body() paginationBlogDto: PaginationBlogDto) {
    return await this.blogService.pagination(paginationBlogDto);
  }
}
