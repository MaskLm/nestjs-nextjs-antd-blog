import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import storage, { fileFilter } from './storage';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MulterModule.register({
      storage,
      limits: { fileSize: 1024 * 1024 * 5 },
      fileFilter,
    }),
  ],
})
export class UserModule {}
