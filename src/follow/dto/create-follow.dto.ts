import { OmitType } from '@nestjs/swagger';
import { Follow } from '../entities/follow.entity';

export class CreateFollowDto extends OmitType(Follow, ['createdAt']) {}
