import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../../user/entities/user.entity';
import { Comment as Comment_Blog } from './comment.entity';

@Entity()
export class Blog {
  @PrimaryKey()
  id: number;
  @Property({ type: 'text' })
  content: string;
  @Property()
  title: string;
  @Property({ nullable: true })
  description: string;
  @Property()
  createdAt: Date = new Date();
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
  @Property({ nullable: true })
  deletedAt: Date;
  @ManyToOne(() => User)
  author: User;
  @OneToMany(() => Comment_Blog, (comment) => comment.topic)
  comments = new Array<Comment_Blog>();
}
