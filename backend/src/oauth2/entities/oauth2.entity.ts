import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
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
  @Property()
  createdAt = new Date();
  @Property()
  deletedAt?: Date;
}
