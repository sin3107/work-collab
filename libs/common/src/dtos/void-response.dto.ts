import { ApiProperty } from '@nestjs/swagger';

export class VoidResponseDTO {
  @ApiProperty({ example: '성공적으로 처리되었습니다.' })
  message: string;
}