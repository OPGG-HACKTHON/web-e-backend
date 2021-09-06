import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { timestamp } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
import { Video } from 'src/videos/entities/video.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('comment')
export class Comment {
  @IsNumber()
  @ApiProperty({ type: Video, description: '댓글의 Video ID' })
  @PrimaryColumn({ name: 'videoId' })
  videoId: number;

  @IsString()
  @ApiProperty({ type: User, description: '댓글의 User ID' })
  @PrimaryColumn({ name: 'userId' })
  userId: string;

  @IsString()
  @ApiProperty({ type: String, description: '댓글 내용' })
  @PrimaryColumn({ name: 'content' })
  content: string;

  @ManyToOne(() => Video, (video) => video.commentVideo)
  @JoinColumn({ name: 'videoId' })
  video: Video;

  @ManyToOne(() => User, (user) => user.commentUser)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ type: timestamp, description: '댓글 작성 시간' })
  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  createdAt: Date;
}
