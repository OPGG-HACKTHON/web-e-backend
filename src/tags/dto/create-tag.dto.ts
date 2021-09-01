import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNumber()
  @ApiProperty({ type: Number, description: '비디오 ID' })
  videoId: number;
  @IsString({ each: true }) // 각각 검사.
  @ApiProperty({
    description: '비디오 태그 목록',
    isArray: true,
    type: String,
  })
  tags: string[];
}
