import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {} //선택적으로 만들기 가능
