/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name } = createUserDto;

    const existing = await this.findByEmail(email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      email,
      passwordHash: hashedPassword,
      name: name || email.split('@')[0],
      role: UserRole.GUEST,
    });

    return this.usersRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }

  async createAdmin(
    email: string,
    password: string,
    name?: string,
  ): Promise<User> {
    const existing = await this.findByEmail(email);
    if (existing) return existing;

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = this.usersRepository.create({
      email,
      passwordHash: hashedPassword,
      name: name || 'Administrator',
      role: UserRole.ADMIN,
    });

    return this.usersRepository.save(admin);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
