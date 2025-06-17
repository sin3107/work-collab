export interface SocialUserPayload {
  provider: 'google' | 'kakao' | 'apple';
  providerId: string;
  email?: string;
  name?: string;
}
