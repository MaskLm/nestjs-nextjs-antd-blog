import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { Account } from '../../account/entities/account.entity';

@Entity()
@Index({ properties: ['openId', 'type'], options: { unique: true } })
export class Oauth2 {
  @PrimaryKey()
  id: number;
  @Property()
  accessToken: string;
  @Property()
  refreshToken: string;
  @Property()
  type: string;
  @Property()
  openId: string;
  @ManyToOne(() => Account)
  account: Account;
  @Property()
  createdAt = new Date();
  @Property()
  deletedAt?: Date;
}
