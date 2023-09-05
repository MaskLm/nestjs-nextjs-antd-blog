import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { PaginationBlogDto } from './dto/pagination-blog.dto';
import { Blog } from './entities/blog.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class BlogService {
  constructor(
    private readonly em: EntityManager,
    private readonly userService: UserService,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    const blog = this.em.create('Blog', createBlogDto);
    await this.em.persistAndFlush(blog);
  }

  findAll() {
    return `This action returns all blog`;
  }

  async findOne(id: number) {
    const blog: Blog = await this.em.findOne('Blog', id);
    if (blog) {
      const sanitizedAuthor = await this.userService.getAuthor(
        blog.author.account.id,
      );
      return {
        ...blog,
        author: sanitizedAuthor,
      };
    }
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    const blog = await this.em.findOne('Blog', id);
    if (blog) {
      const updatedBlog = this.em.assign(blog, updateBlogDto);
      await this.em.persistAndFlush(updatedBlog);
      return updatedBlog;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }

  async pagination(paginationBlogDto: PaginationBlogDto) {
    const qb = this.em.createQueryBuilder(Blog, 'blog');
    qb.offset((paginationBlogDto.current - 1) * paginationBlogDto.pageSize);
    qb.limit(paginationBlogDto.pageSize);
    let items = await qb.getResult();
    items = await Promise.all(
      items.map(async (item) => {
        const sanitizedAuthor = await this.userService.getAuthor(
          item.author.account.id,
        );
        return {
          ...item,
          author: sanitizedAuthor,
        };
      }),
    );
    const total = await qb.getCount();
    return { items, total };
  }
}
