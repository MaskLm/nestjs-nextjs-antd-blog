import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @MinLength(5, {
    message: 'Username must be at least 5 characters long',
  })
  @MaxLength(20, {
    message: 'Username must be at most 20 characters long',
  })
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(32, {
    message: 'Password must be at most 32 characters long',
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message:
        'Password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, and 1 number',
    },
  )
  password: string;
}
