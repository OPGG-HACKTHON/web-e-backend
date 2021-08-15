import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNotEmpty, IsEmpty } from 'class-validator';
import { Game } from '../enums/game';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: '사용자 ID' })
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: '제목' })
  readonly describe: string;

  @IsEnum(Game)
  @IsNotEmpty()
  @ApiProperty({ type: String, description: '게임 카테고리' })
  readonly category: string;

  @IsString()
  @ApiPropertyOptional({ type: String, description: '설명' })
  readonly description: string;

  @IsEmpty()
  @ApiProperty({
    type: 'file',
    name: 'video',
    format: 'binary',
    description: '파일',
  })
  readonly file: any; // video만 올리는 법?
}
