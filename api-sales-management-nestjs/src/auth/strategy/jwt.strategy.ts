import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from '../../user/user.service';
import TokenPayload from '../dto/tokenPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),

      ignoreExpiration: false,
      secretOrKey: config.get('JWT_KEY'),
    });
  }

  async validate(payload: TokenPayload) {
    return payload;
  }
}

// extract from header
//  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
