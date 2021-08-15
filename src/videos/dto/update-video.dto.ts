import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { Game } from '../enums/game';
import { CreateVideoDto } from './create-video.dto';

export class UpdateVideoDto extends PartialType(
  OmitType(CreateVideoDto, ['userId'] as const),
) {}

/* Modify later
function CustomValidateIf () {
  return ValidateIf((o) => o !== '' && o !== null && o !== undefined)
}

export class UpdateVideoDto {
  @CustomValidateIf()
  @IsString()
  @ApiPropertyOptional({ type: String, description: '제목' })
  readonly describe: string;

  @ValidateIf((o) => o !== '' && o !== null && o !== undefined)
  @IsEnum(Game)
  @ApiPropertyOptional({ type: String, description: '게임 카테고리' })
  readonly category: string;

  @ValidateIf((o) => o !== '' && o !== null && o !== undefined)
  @IsString()
  @ApiPropertyOptional({ type: String, description: '설명' })
  readonly description: string;

  @ValidateIf((o) => o !== {} && o !== null && o !== undefined)
  @ApiPropertyOptional({
    type: 'file',
    name: 'video',
    format: 'binary',
    description: '파일',
  })
  readonly file: any;
}
*/
