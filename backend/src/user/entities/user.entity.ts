import { Entity, OneToMany, OneToOne, Property, Unique } from '@mikro-orm/core';
import { Account } from '../../account/entities/account.entity';
import { PrivateSettings } from './PrivateSettings';
import { Blog } from '../../blog/entities/blog.entity';
import { Resource } from './resource.entity';

@Entity()
export class User {
  @Property()
  @Unique()
  email: string;
  @Property({ nullable: true })
  avatarURL: string;
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
