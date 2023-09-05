import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Resource } from './entities/resource.entity';
import { User } from './entities/user.entity';
import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}

  async create(createUserDto: CreateUserDto) {
    const user: User = this.em.create('User', createUserDto);
    await this.em.persistAndFlush(user);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    return await this.em.findOne('User', id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.em.findOne('User', id);
    if (user) {
      const updatedUser = this.em.assign(user, updateUserDto);
      await this.em.persistAndFlush(updatedUser);
      return updatedUser;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async uploadAvatar(avatar: Express.Multer.File, id?: number) {
    try {
      const user: User = await this.em.findOne('User', { account: id });
      const resource: Resource = this.em.create('Resource', {
        path: avatar.path,
        owner: user,
      });
      await this.em.persistAndFlush(resource);
      return {
        url: `${process.env.BACKEND_URL}/${avatar.path}`,
      };
    } catch (e) {
      fs.unlinkSync(avatar.path);
      throw new HttpException('Error uploading avatar', 500);
    }
  }

  async getAvatar(id: number) {
    const user: User = await this.em.findOne('User', { account: id });
    return user.avatarURL;
  }

  async getAuthor(id: number) {
    const user = await this.em.findOne(
      User,
      { account: id },
      {
        fields: ['email', 'avatarURL', 'nickname'],
      },
    );
    return user;
  }
}
