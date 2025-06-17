import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class GoogleAuthGuard extends AuthGuard('google') {}
export class KakaoAuthGuard extends AuthGuard('kakao') {}
export class AppleAuthGuard extends AuthGuard('apple') {}