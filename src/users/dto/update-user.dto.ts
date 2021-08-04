import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends OmitType(User, ['userId', 'userRole']) {} //선택적으로 만들기 가능
