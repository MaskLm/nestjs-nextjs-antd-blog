import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../../user/entities/user.entity';
import { Blog } from './blog.entity';

@Entity()
@Index({ properties: ['from_user', 'to_user'] })
//@Index({ properties: ['from_user', 'topic'] })
@Index({ properties: ['topic'] })
export class Comment {
  @PrimaryKey()
  id: number;
  @ManyToOne(() => User, { nullable: false })
  from_user: User;
  @ManyToOne(() => User, { nullable: true })
  to_user: User;
  @Property()
  content: string;
  @ManyToOne(() => Blog, { nullable: false })
  topic: Blog;
  @Property({ type: 'datetime' })
  createdAt: Date = new Date();
  @Property({ type: 'datetime', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
  @Property({ type: 'datetime', nullable: true })
  deletedAt: Date;
}
