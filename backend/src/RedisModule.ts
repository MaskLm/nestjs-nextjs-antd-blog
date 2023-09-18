import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useValue: new Redis({
        port: parseInt(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB),
      }),
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
