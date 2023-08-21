import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Account } from '../../account/entities/account.entity';

@Entity()
export class Auth {
  @PrimaryKey()
  id: number;
  @ManyToOne(() => Account)
  account: Account;
  @Property()
  userAgent: string;
  @Property()
  createdAt = new Date();
  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
  @Property({ nullable: true })
  deletedAt?: Date;
  @Property({ nullable: true })
  ipv4: string;
  @Property()
  refreshToken: string;
}
