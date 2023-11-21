import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Roles } from '../auth/decorator/roles-decorator';
import { RolesGuard } from '../auth/guard/role-auth-guard';
import { PaginationBlogDto } from './dto/pagination-blog.dto';
import { Public } from '../auth/decorator/public-decorator';
import { FindAllBlogDto } from './dto/findAll-blog.dto';

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
  async findAll(@Query() findAllBlogDto: FindAllBlogDto) {
    console.log(findAllBlogDto);
    return await this.blogService.findAll(findAllBlogDto);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.blogService.findOne(+id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return await this.blogService.update(+id, updateBlogDto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.blogService.remove(+id);
  }

  @Public()
  @Post('pagination')
  async pagination(@Body() paginationBlogDto: PaginationBlogDto) {
    return await this.blogService.pagination(paginationBlogDto);
  }
}
