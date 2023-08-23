import { PrivateSettings } from '../entities/PrivateSettings';

export class CreateUserDto {
  email: string;
  nickname: string;
  age?: number;
  avatarURL?: string;
  privateSettings?: PrivateSettings;
  account: number;
}
