import { OmitType } from '@nestjs/swagger';
import { CreateVideoDto } from './create-video.dto';

export class UpdateVideoDto extends OmitType(CreateVideoDto, ['userId'] as const) {}