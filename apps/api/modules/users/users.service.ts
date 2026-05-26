import { CreateUserDto } from './dto/create-user.dto';
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const hashPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByEmail(email: string) {
    return this.prisma.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.findUnique({
      where: { id },
    });

    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
