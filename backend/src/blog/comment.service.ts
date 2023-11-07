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
    qb.orderBy({ createdAt: 'ASC' });
    const comments: Comment[] = await qb.getResult();
    const commentItems: CommentItem[] = comments.map((comment: Comment) => {
      return {
        from_user_Id: comment.from_user.account.id,
        from_user_nickname: comment.from_user.nickname,
        from_user_avatar: comment.from_user.avatarURL,
        to_user_nickname: comment.to_user?.nickname || null,
        to_user_Id: comment.to_user?.account.id || null,
        datetime: comment.createdAt,
      };
    });
    return commentItems;
  }
}
