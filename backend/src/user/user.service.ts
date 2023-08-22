import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}

  async create(createUserDto: CreateUserDto, avatar: Express.Multer.File) {}

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  uploadAvatar(avatar: Express.Multer.File, id?: number) {
    return {
      url: `${process.env.BACKEND_URL}/public/avatar/${avatar.filename}`,
    };
  }
}
