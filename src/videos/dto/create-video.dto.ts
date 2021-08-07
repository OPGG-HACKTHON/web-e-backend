import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Game } from '../enums/game';

export class CreateVideoDto {
  @IsString()
  @ApiProperty({ type: String, description: '사용자 ID' })
  readonly userId: string;

  @IsString()
  @ApiProperty({ type: String, description: '동영상 이름' })
  readonly name: string;

  @IsEnum(Game)
  @ApiProperty({ type: Number, description: '동영상 게임' })
  readonly game: number;

  @IsString()
  @ApiProperty({ type: String, description: '동영상 url' })
  readonly url: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '동영상 설명' })
  readonly description: string;
}