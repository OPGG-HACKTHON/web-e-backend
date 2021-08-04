import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
// import { movie } from '../movie/movie.entity';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity('USER')
export class User {
  @IsString()
  @ApiProperty({ type: String, description: '로그인 ID' })
  @PrimaryColumn()
  userId: string;

  @IsString()
  @ApiProperty({ type: String, description: '사용자 비밀번호' })
  @Column()
  userPassword: string;

  @IsEmail()
  @ApiProperty({ example: 'watpl@gmail.com', description: '사용자 이메일' })
  @Column()
  userEmail: string;

  @IsString()
  @ApiProperty({ type: String, description: '사용자프로필' })
  @Column({ nullable: true })
  userPhoto: string;

  @IsString()
  @ApiProperty({ type: String, description: '사용자 소개' })
  @Column({ nullable: true })
  userIntro: string;

  @IsString()
  @ApiProperty({ type: String, description: '관리자 여부' })
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  userRole: Role;

  //   @OneToMany(() => Movie, (Movie) => Movie.user)
  //   movies: Movie[];
}
