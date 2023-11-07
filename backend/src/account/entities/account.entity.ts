import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Unique,
} from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { Auth } from '../../auth/entities/auth.entity';
import { User } from '../../user/entities/user.entity';
import { Oauth2 } from '../../oauth2/entities/oauth2.entity';

@Entity()
@Index({ properties: ['username'] })
@Index({ properties: ['email'] })
export class Account {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Property()
  username: string;

  @Property({ hidden: true })
  password: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  @Unique()
  @Property()
  email: string;

  @Property()
  role: string[] = ['user'];

  @BeforeCreate()
  private async hashPasswordBeforeCreate() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  @BeforeUpdate()
  private async hashPasswordBeforeUpdate() {
    function isBcryptHash(str) {
      return /^\$2[ayb]\$.{56}$/.test(str);
    }
    if (isBcryptHash(this.password)) return;
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  @OneToMany(() => Auth, (auth) => auth.account, { nullable: true })
  auth: Auth[];

  @OneToOne(() => User, { nullable: true, owner: true })
  user: User;

  @OneToMany(() => Oauth2, (oauth2) => oauth2.account, { nullable: true })
  oauth2: Oauth2[];
}
