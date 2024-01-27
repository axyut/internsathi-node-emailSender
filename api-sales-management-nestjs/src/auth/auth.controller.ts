import {
  Controller,
  Body,
  Get,
  Post,
  Req,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../user/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator';
import { JwtAuthGuard } from './guard/jwt.guard';
import { LoginDto } from './dto/login.dto';
import TokenPayload from './dto/tokenPayload.interface';
import { PublicRoute } from './decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Login
  @PublicRoute()
  @HttpCode(200)
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req, @Body() loginDto: LoginDto, @Res() res) {
    const user: User = req.user;
    const payload: TokenPayload = {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    const token = this.jwt.sign(payload);
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRE',
    )}`;
    res.setHeader('Set-Cookie', cookie);
    user.password = undefined;

    console.log(`User ${user.email} logged in`);
    return res.json({ user, token });
  }

  // Logout
  @Get('log-out')
  //@UseGuards(JwtAuthGuard)
  async logOut(@Req() req, @Res() res) {
    const set = `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    res.setHeader('Set-Cookie', set);
    return res.status(HttpStatus.OK).json({ msg: 'Logged out' });
  }
}
