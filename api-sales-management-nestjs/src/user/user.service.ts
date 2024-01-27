import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { ConfigService } from '@nestjs/config';

const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  // Create New User
  async create(createUser: CreateUserDto): Promise<User> {
    let user: User = new User();
    user.email = createUser.email;
    user.firstName = createUser.firstName;
    user.lastName = createUser.lastName;
    // hash password with bcrypt
    user.password = await bcrypt.hash(createUser.password, saltOrRounds);
    user.role = 'NORMAL';

    return this.userRepo.save(user);
  }

  // Find User By Email
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email: email } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  // Find User By Id
  async findById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  // Find all Users
  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  // Remove a User
  async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }

  // Update a User
  async update(id: number, updateUser: UpdateUserDto): Promise<Object> {
    const updated = await this.userRepo.update(id, {
      firstName: updateUser.firstName,
      lastName: updateUser.lastName,
      email: updateUser.email,
      password: updateUser.password,
    });
    if (updated) {
      return { msg: 'User Updated' };
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
}
