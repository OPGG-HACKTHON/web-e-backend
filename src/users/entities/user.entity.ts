import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Video } from 'src/videos/entities/video.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { timestamp } from 'rxjs';
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

  @IsString()
  @ApiProperty({ type: String, description: '사용자프로필URL' })
  @Column({ nullable: true })
  userPhotoURL: string;

  @IsString()
  @ApiProperty({ type: String, description: '사용자커버 URL' })
  @Column({ nullable: true })
  userCoverURL: string;

  @IsString()
  @ApiProperty({ type: String, description: '커버 색깔' })
  @Column({ nullable: true })
  userColor: string;

  @IsString()
  @IsEnum(GameFeed)
  @ApiProperty({
    type: String,
    description: '사용자 게임 Default 피드',
    default: GameFeed.LOL,
  })
  @Column({ type: 'enum', enum: GameFeed, default: GameFeed.LOL })
  userFeed: GameFeed;

  @IsString()
  @IsEnum(LOLTier)
  @ApiProperty({
    type: String,
    description: 'league of legend(ll) 티어',
    default: LOLTier.UNRANKED,
  })
  @Column({ type: 'enum', enum: LOLTier, default: LOLTier.UNRANKED })
  lolTier: LOLTier;

  @IsString()
  @IsEnum(PUBGTier)
  @ApiProperty({
    type: String,
    description: 'battle ground(bg) 티어',
    default: PUBGTier.UNRANKED,
  })
  @Column({ type: 'enum', enum: PUBGTier, default: PUBGTier.UNRANKED })
  pubgTier: PUBGTier;

  @IsString()
  @IsEnum(WatchTier)
  @ApiProperty({
    type: String,
    description: 'overwatch(ow) 티어',
    default: WatchTier.UNRANKED,
  })
  @Column({ type: 'enum', enum: WatchTier, default: WatchTier.UNRANKED })
  watchTier: WatchTier;

  @IsString()
  @ApiProperty({ type: String, description: '사용자 소개' })
  @Column({ nullable: true })
  userIntro: string;

  @IsString()
  @IsEnum(Role)
  @ApiProperty({ type: String, description: '관리자 여부' })
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  userRole: Role;

  @ApiProperty({ type: timestamp, description: '최근 로그인 시간' })
  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  loginAt: Date;

  @ApiProperty({ type: Video, description: '사용자 동영상' })
  @OneToMany(() => Video, (video) => video.user)
  videos: Video[];

  //follower 기능 m:n connection, self join
  @ApiProperty({ type: Follow, description: '팔로우 요청하는 사용자' })
  @OneToMany(() => Follow, (follow) => follow.user)
  user: Follow[];

  @ApiProperty({ type: Video, description: '팔로우 당하는 사용자' })
  @OneToMany(() => Follow, (follow) => follow.following)
  following: Follow[];
}
