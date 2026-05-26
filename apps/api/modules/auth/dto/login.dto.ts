import { IsString, IsEmail } from 'class-validator';

class LoginDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;
}
