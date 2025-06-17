import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-apple';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@common';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('APPLE_CLIENT_ID'),
      teamID: configService.get<string>('APPLE_TEAM_ID'),
      keyID: configService.get<string>('APPLE_KEY_ID'),
      privateKey: configService.get<string>('APPLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      callbackURL: configService.get<string>('APPLE_CALLBACK_URL'),
      passReqToCallback: false,
      scope: ['name', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, idToken: any, profile: any, done: Function) {
    const user = {
      provider: Provider.Apple,
      providerId: idToken.sub,
      email: idToken.email,
      name: profile?.name || null,
    };
    done(null, user);
  }
}
