import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategy/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_KEY'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRE'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy],
  exports: [],
})
export class AuthModule {}

// JwtModule.registerAsync({
//   imports: [ConfigModule],
//   inject: [ConfigService],
//   useFactory: (config: ConfigService) => ({
//     secret: config.get('JWT_KEY'),
//     signOptions: {
//       expiresIn: config.get<string>('JWT_EXPIRE'),
//     },
//   }),
// });
