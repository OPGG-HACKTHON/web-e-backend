import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Video } from 'src/videos/entities/video.entity';
// import { movie } from '../movie/movie.entity';

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

  @IsBoolean()
  @ApiProperty({ type: String, description: '관리자 여부' })
  @Column({ default: false })
  isAdmin: boolean;

  @ApiProperty({ type: Video, description: '사용자 동영상' })
  @OneToMany((type) => Video, (video) => video.user)
  videos: Video[];

  //   @OneToMany(() => Movie, (Movie) => Movie.user)
  //   movies: Movie[];
}
