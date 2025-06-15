import { Provider, UserRole, UserStatus } from '@common';
import { ApiProperty } from '@nestjs/swagger';

export class GetMeResponseDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ type: Date })
  birth: Date;

  @ApiProperty({ enum: Provider })
  provider: Provider;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty({ enum: UserRole })
  role: UserRole;
}
