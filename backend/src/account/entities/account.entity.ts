import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { Auth } from '../../auth/entities/auth.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Account {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Property()
  username: string;

  @Property()
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
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  @OneToMany(() => Auth, (auth) => auth.account, { nullable: true })
  auth: Auth[];

  @OneToOne(() => User, { nullable: true, owner: true })
  user: User;
}
