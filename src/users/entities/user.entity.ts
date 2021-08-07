import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
// import { movie } from '../movie/movie.entity';

//사용자 권한
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum GameFeed {
  LOL = 'LOL',
  PUBG = 'PUBG',
  WATCH = 'WATCH',
}

//league of legend tier
export enum LOLTier {
  UNRANKED = 'UNRANKED',
  IRON = 'IRON',
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
  MASTER = 'MASTER',
  GRANDMASTER = 'GRANDMASTER',
  CHALLENGER = 'CHALLENGER',
}

//overwatch Tier
export enum WatchTier {
  UNRANKED = 'UNRANKED',
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
  MASTER = 'MASTER',
  GRANDMASTER = 'GRANDMASTER',
  RANKER = 'RANKER',
}

//battle ground tier
export enum PUBGTier {
  UNRANKED = 'UNRANKED',
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
  MASTER = 'MASTER',
}

@Entity('user')
export class User {
  @IsString()
  @ApiProperty({ type: String, description: '로그인 ID' })
  @PrimaryColumn()
  userId: string;

  @IsString()
  @ApiProperty({ type: String, description: '유저 명' })
  @Column()
  userName: string;

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
  @IsEnum(GameFeed, { each: true })
  @ApiProperty({ type: String, description: '사용자 게임 Default 피드' })
  @Column({ nullable: true })
  userFeed: string;

  @IsString()
  @IsEnum(LOLTier, { each: true })
  @ApiProperty({ type: String, description: 'league of legend(ll) 티어' })
  @Column({ type: 'enum', enum: LOLTier, default: LOLTier.UNRANKED })
  lolTier: string;

  @IsString()
  @IsEnum(PUBGTier, { each: true })
  @ApiProperty({ type: String, description: 'battle ground(bg) 티어' })
  @Column({ type: 'enum', enum: PUBGTier, default: PUBGTier.UNRANKED })
  pubgTier: string;

  @IsString()
  @IsEnum(WatchTier, { each: true })
  @ApiProperty({ type: String, description: 'overwatch(ow) 티어' })
  @Column({ type: 'enum', enum: WatchTier, default: WatchTier.UNRANKED })
  watchTier: string;

  @IsString()
  @ApiProperty({ type: String, description: '사용자 소개' })
  @Column({ nullable: true })
  userIntro: string;

  @IsString()
  @IsEnum(Role, { each: true })
  @ApiProperty({ type: String, description: '관리자 여부' })
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  userRole: Role;

  //   @OneToMany(() => Movie, (Movie) => Movie.user)
  //   movies: Movie[];
}
