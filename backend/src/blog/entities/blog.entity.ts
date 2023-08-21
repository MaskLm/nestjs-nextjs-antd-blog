import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Blog {
  @PrimaryKey()
  id: number;
  @Property({ type: 'text' })
  content: string;
  @Property()
  title: string;
  @ManyToOne(() => User)
  author: User;
}
