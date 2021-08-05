import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
export class LoginUserDto extends PickType(User, [
  'userId',
  'userPassword',
] as const) {}
