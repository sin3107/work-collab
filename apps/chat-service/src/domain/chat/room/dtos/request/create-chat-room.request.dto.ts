import { ChatRoomType } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChatRoomRequestDTO {
    @ApiProperty({
        example: 1, description: '팀 ID',
    })
    @IsOptional()
    @IsNumber()
    teamId?: number | null;

    @ApiProperty({
        example: '디자인 팀 채팅방',
        description: '채팅방 이름',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        enum: ChatRoomType,
        example: ChatRoomType.PRIVATE,
        description: '채팅방 유형 (DEFAULT, PRIVATE, DM)',
    })
    @IsEnum(ChatRoomType)
    type: ChatRoomType;

    @ApiProperty({
        example: 5,
        description: '채팅방 생성자 ID',
    })
    @IsNumber()
    createdBy: number;

    @ApiProperty({
        example: true,
        description: 'DM 타입 - 기존 방 재사용 여부',
        required: false,
    })
    @IsOptional()
    isReused?: boolean;
}