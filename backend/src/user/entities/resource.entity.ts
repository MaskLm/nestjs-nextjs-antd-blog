import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from './user.entity';

@Entity()
export class Resource {
  @PrimaryKey()
  id: number;
  @Property()
  path: string;
  @ManyToOne(() => User)
  owner: User;
}
