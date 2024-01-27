import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { User } from 'src/user/entity/user.entity';
import { UserService } from '../../user/user.service';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<User> {
    const user: User = await this.userService.findByEmail(email);
    const match = await bcrypt.compare(password, user.password);
    if (user && match) return user;

    if (user == undefined)
      throw new UnauthorizedException(`User not found of this email ${email}`);
    if (user.password != password)
      throw new UnauthorizedException(`Invalid Credentials!`);
  }
}
