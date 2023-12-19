import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { PaginationBlogDto } from './dto/pagination-blog.dto';
import { Blog } from './entities/blog.entity';
import { UserService } from '../user/user.service';
import { FindAllBlogDto } from './dto/findAll-blog.dto';

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

  async findAll(findAllBlogDto: FindAllBlogDto) {
    const qb = this.em.createQueryBuilder(Blog, 'blog');
    qb.orderBy({
      [findAllBlogDto.sortField || 'createdAt']:
        findAllBlogDto.sortOrder === 'ascend' ? 'ASC' : 'DESC',
    });
    qb.offset((findAllBlogDto.current - 1) * findAllBlogDto.pageSize);
    qb.limit(findAllBlogDto.pageSize);
    qb.where({ deletedAt: null });
    if (findAllBlogDto.filters) {
      Object.entries(findAllBlogDto.filters).forEach(([key, value]) => {
        qb.andWhere({ [key]: { $like: `%${value}%` } });
      });
    }
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
    return items;
  }

  async findOne(id: number) {
    const blog: Blog = await this.em.findOne('Blog', { id, deletedAt: null });
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

  async remove(id: number) {
    const blog: Blog = await this.em.getReference('Blog', id);
    blog.deletedAt = new Date();
    await this.em.persistAndFlush(blog);
  }

  async pagination(paginationBlogDto: PaginationBlogDto) {
    const qb = this.em.createQueryBuilder(Blog, 'blog');
    qb.where({ deletedAt: null });
    if (paginationBlogDto.filters?.title)
      qb.andWhere({ title: { $like: `%${paginationBlogDto.filters.title}%` } });
    qb.orderBy({ createdAt: 'DESC' });
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
