import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@common';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      callbackURL: configService.get<string>('KAKAO_CALLBACK_URL'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
    const kakaoAccount = profile._json.kakao_account;

    const user = {
      provider: Provider.Kakao,
      providerId: profile.id,
      email: kakaoAccount?.email || `kakao_${profile.id}@kakao.com`,
      name: kakaoAccount?.profile?.nickname || '카카오유저',
    };

    done(null, user);
  }
}
