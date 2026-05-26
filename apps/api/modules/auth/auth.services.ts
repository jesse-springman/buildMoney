import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'modules/users/dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'modules/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);
    const token = this.generateToken(user.id, user.email);
    return { user, ...token };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Credencias inválidas');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credencias inválidas');
    }

    //remove senha antes de retornar
    const { password: _, ...userWithoutPassword } = user;

    const token = this.generateToken(user.id, user.email);
    return { user: userWithoutPassword, ...token };
  }

  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
