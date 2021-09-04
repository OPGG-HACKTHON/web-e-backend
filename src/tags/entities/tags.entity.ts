import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Video } from 'src/videos/entities/video.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('tag')
export class Tag {
  @IsNumber()
  @ApiProperty({ type: Video, description: '태그의 Video ID' })
  @PrimaryColumn({ name: 'videoId' })
  videoId: number;

  @IsString()
  @ApiProperty({ type: String, description: '태그 명' })
  @PrimaryColumn({ name: 'tagName' })
  tagName: string;

  @ManyToOne(() => Video, (video) => video.tagVideo)
  @JoinColumn({ name: 'videoId' })
  video: Video;
}
