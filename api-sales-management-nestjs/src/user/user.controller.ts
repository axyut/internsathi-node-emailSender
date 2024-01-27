import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  UseGuards,
  Req,
  Param,
  Patch,
  HttpCode,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { Constants } from '../utils/constants';
import { PublicRoute } from 'src/auth/decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PublicRoute()
  @Post('/signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Patch request to update user
  @ApiSecurity('JWT-auth')
  //@UseGuards(AuthGuard('jwt'))
  @Post('/update')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const id = req.user.id;
    return this.userService.update(+id, updateUserDto);
  }

  // Delete request to delete user itself
  @ApiSecurity('JWT-auth')
  @Get('/delete')
  //@UseGuards(AuthGuard('jwt'))
  remove(@Req() req) {
    const id = req.user.id;
    return this.userService.remove(+id);
  }
}
