import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

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
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '사용자 이름' })
  userName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '사용자 비밀번호' })
  userPassword?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '사용자프로필 사진 경로' })
  userPhotoURL?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '사용자 커버 사진경로' })
  userCoverURL?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '사용자 프로필 컬러' })
  userColor?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '사용자 소개' })
  userIntro?: string;

  @IsOptional()
  @IsEnum(GameFeed)
  @ApiProperty({
    type: String,
    description: '사용자 게임 Default 피드',
    default: GameFeed.LOL,
  })
  userFeed?: GameFeed;

  @IsOptional()
  @IsEnum(LOLTier)
  @ApiProperty({
    type: String,
    description: '사용자 롤 티어',
    default: LOLTier.UNRANKED,
  })
  lolTier?: LOLTier;

  @IsOptional()
  @IsEnum(PUBGTier)
  @ApiProperty({
    type: String,
    description: '사용자 배그 티어',
    default: PUBGTier.UNRANKED,
  })
  pubgTier?: PUBGTier;

  @IsOptional()
  @IsEnum(WatchTier)
  @ApiProperty({
    type: String,
    description: '사용자 오버워치 티어',
    default: WatchTier.UNRANKED,
  })
  watchTier?: WatchTier;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '사용자 롤 아이디' })
  userLolId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '사용자 오버워치 아이디' })
  userWatchId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '사용자 배그 아이디' })
  userPubgId?: string;
}
