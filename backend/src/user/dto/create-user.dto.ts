import { PrivateSettings } from '../entities/PrivateSettings';

export class CreateUserDto {
  email: string;
  nickname: string;
  password: string;
  age: number;
  avatarURL?: string;
  privateSettings: PrivateSettings;
}
