import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { timestamp } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
import { Video } from 'src/videos/entities/video.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('videoLike')
export class VideoLike {
  @IsString()
  @ApiProperty({ type: User, description: '비디오에 좋아요 누르는 사람' })
  @PrimaryColumn({ name: 'userId' })
  userId: string;

  @IsString()
  @ApiProperty({ type: User, description: '비디오에 좋아요 받는 사람' })
  @PrimaryColumn({ name: 'likeId' })
  likeId: string;

  @IsString()
  @ApiProperty({ type: Video, description: '좋아요 받는 비디오' })
  @PrimaryColumn({ name: 'videoId' })
  videoId: string;

  @ManyToOne(() => User, (user) => user.likeUser)
  @JoinColumn({ name: 'userId' })
  likeUser: User;

  @ManyToOne(() => User, (user) => user.likedUser)
  @JoinColumn({ name: 'likeId' })
  likedUser: User;

  @ManyToOne(() => Video, (video) => video.likedVideo)
  @JoinColumn({ name: 'videoId' })
  likedVideo: Video;

  @ApiProperty({ type: timestamp, description: '좋아요 시작 시간' })
  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  createdAt: Date;
}
