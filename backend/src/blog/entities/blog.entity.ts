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
  @Property()
  createdAt: Date = new Date();
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
  @ManyToOne(() => User)
  author: User;
}
