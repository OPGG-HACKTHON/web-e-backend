import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

//nullable json 허용을 위한 picktype, omitType이 아닌 직접 작성
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '사용자 비밀번호' })
  userPassword?: string;
  @IsOptional()
  @IsEmail()
  @ApiProperty({ example: 'watpl@gmail.com', description: '사용자 이메일' })
  userEmail?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '사용자프로필' })
  userPhoto?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '사용자 소개' })
  userIntro?: string;
}
