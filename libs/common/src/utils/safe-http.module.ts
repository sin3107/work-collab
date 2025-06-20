import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SafeHttpService } from './safe-http.service';
import { ErrorModule } from '@error';

@Module({
  imports: [HttpModule, ErrorModule],
  providers: [SafeHttpService],
  exports: [SafeHttpService],
})
export class SafeHttpModule {}