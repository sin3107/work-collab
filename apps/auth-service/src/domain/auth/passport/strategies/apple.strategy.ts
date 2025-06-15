import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-apple';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
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

  async validate(
    accessToken: string,
    refreshToken: string,
    idToken: any,
    profile: Profile,
  ): Promise<{
    provider: string;
    providerId: string;
    email: string;
    name?: string;
  }> {
    const { id, emails } = profile;

    return {
      provider: Provider.Apple,
      providerId: id,
      email: emails?.[0]?.value || `apple_${uuid()}@apple.com`,
      name: profile.name?.firstName,
    };
  }
}
