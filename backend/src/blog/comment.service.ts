import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserService } from 'src/user/user.service';
import { Comment } from './entities/comment.entity';
import { CommentItem } from './interfaces/commentItem.interface';
import { Blog } from './entities/blog.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly em: EntityManager,
    private readonly userService: UserService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const comment = this.em.create('Comment', createCommentDto);
    return await this.em.persistAndFlush(comment);
  }

  async findByTopicIdWithAuthorAndAvatar(
    topicId: number,
  ): Promise<CommentItem[]> {
    const qb = this.em.createQueryBuilder(Comment, 'comment');
    qb.where({ topic: topicId });
    qb.andWhere({ deletedAt: null });
    qb.orderBy({ createdAt: 'ASC' });
    const comments: Comment[] = await qb.getResult();
    const commentItems: CommentItem[] = await Promise.all(
      comments.map(async (comment: Comment): Promise<CommentItem> => {
        const from_user = await this.userService.getAuthor(
          comment.from_user.account.id,
        );
        const to_user = await this.userService.getAuthor(
          comment.to_user?.account.id,
        );
        return {
          id: comment.id,
          from_user_Id: from_user.account.id,
          from_user_nickname: from_user.nickname,
          from_user_avatar: from_user.avatarURL,
          to_user_nickname: to_user?.nickname || null,
          to_user_Id: to_user?.account.id || null,
          datetime: comment.createdAt,
          content: comment.content,
        } as CommentItem;
      }),
    );
    return commentItems;
  }

  async delete(id: number) {
    const comment = await this.em.findOne(Comment, id);
    comment.deletedAt = new Date();
    await this.em.persistAndFlush(comment);
  }
}
