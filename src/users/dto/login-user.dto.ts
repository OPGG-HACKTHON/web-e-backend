import { CreateUserDto } from './create-user.dto';
import { OmitType } from '@nestjs/swagger';

export class LoginUserDto extends OmitType(CreateUserDto, ['name'] as const) {} //선택적으로 만들기 가능
