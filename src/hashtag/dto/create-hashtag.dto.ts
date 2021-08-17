import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHashtagDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: '해시태그' })
  readonly hashtag: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: '게임 카테고리' })
  readonly category: string;
}
