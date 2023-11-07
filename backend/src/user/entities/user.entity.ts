import { Entity, OneToMany, OneToOne, Property, Unique } from '@mikro-orm/core';
import { Account } from '../../account/entities/account.entity';
import { PrivateSettings } from './PrivateSettings';
import { Blog } from '../../blog/entities/blog.entity';
import { Resource } from './resource.entity';
import { Comment as Comment_Blog } from '../../blog/entities/comment.entity';

@Entity()
export class User {
  @Property()
  @Unique()
  email: string;
  @Property({ nullable: true })
  avatarURL: string;
  @Unique()
  @Property()
  nickname: string;
  @Property({ nullable: true })
  age: number;
  @Property({ type: 'json' })
  privateSettings: PrivateSettings = {
    emailVisible: false,
    ageVisible: false,
  };
  @OneToMany(() => Blog, (blog) => blog.author)
  blogs = new Array<Blog>();
  @OneToMany(() => Comment_Blog, (comment) => comment.from_user)
  comments = new Array<Comment_Blog>();
  @OneToMany(() => Comment_Blog, (comment) => comment.to_user)
  comments_received = new Array<Comment_Blog>();
  @OneToOne(() => Account, { primary: true })
  account: Account;
  @OneToMany(() => Resource, (resource) => resource.owner)
  resources = new Array<Resource>();

  @Property({ type: 'date' })
  createdAt = new Date();
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();
  @Property({ type: 'date', nullable: true })
  deletedAt?: Date;
}
