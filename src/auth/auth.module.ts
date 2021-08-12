import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RoleGuard } from './role.guard';
import { ConfigService } from '@nestjs/config';
import { FollowModule } from 'src/follow/follow.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    FollowModule,
    //.env에서 값 사용을 위함.
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwtConstants.secret'),
          signOptions: {
            expiresIn: configService.get<string | number>('expirationTime'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RoleGuard,
    ConfigService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
