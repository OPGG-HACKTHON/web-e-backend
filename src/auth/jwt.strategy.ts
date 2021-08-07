import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwtConstants.secret'),
    });
  }

  async validate(payload: any) {
    //payload값 return
    return {
      id: payload.userId,
      email: payload.userEmail,
      photo: payload.userPhoto,
      intro: payload.userIntro,
      feed: payload.userFeed,
      lolTier: payload.lolTier,
      pubgTier: payload.pubgTier,
      watchTier: payload.watchTier,
      role: payload.userRole,
    };
  }
}
