import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  //코드 간결하게 만들어주며, validation을 제공해 줄 수 있다
  @IsString()
  @ApiProperty({ type: String, description: '유저 ID' })
  readonly ID: string;

  @IsString()
  @ApiProperty({ type: String, description: '유저 이름' })
  readonly name: string;

  @IsString()
  @ApiProperty({ type: String, description: '유저 비밀번호' })
  readonly password: string;
  // @IsString({ each: true }) //각각 검사.
  // readonly genres: string[];
}
