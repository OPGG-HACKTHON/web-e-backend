import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Game } from '../enums/game';
import { ApiProperty } from '@nestjs/swagger';
import { VideoHashtag } from 'src/hashtag/entities/video-hashtag.entity';

@Entity()
export class Video {
  @IsNumber()
  @ApiProperty({ type: Number, description: 'ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @IsDate()
  @ApiProperty({ type: Date, description: '업로드 날짜' })
  @CreateDateColumn()
  createTime: Date;

  @IsDate()
  @ApiProperty({ type: Date, description: '수정 날짜' })
  @UpdateDateColumn()
  updateTime: Date;
  // Get ID 조회시에 views값 변경시에 변경되는 Issue 있음

  @IsNumber()
  @ApiProperty({ type: Number, description: '조회수' })
  @Column({ type: 'int', default: 0 })
  views: number;

  @ManyToOne((type) => User, (user) => user.videos)
  @JoinColumn()
  user: User;

  @IsString()
  @ApiProperty({ type: String, description: '제목' })
  @Column()
  describe: string;

  // @IsUrl()
  @IsString()
  @ApiProperty({ type: String, description: 'URL' })
  @Column('varchar')
  src: string;

  @IsEnum(Game)
  @ApiProperty({ type: String, description: '게임 카테고리' })
  @Column({ type: 'enum', enum: Game })
  category: string;

  @IsString()
  @ApiProperty({ type: String, description: '설명' })
  @Column({ type: 'varchar', default: '' })
  description: string;

  @ApiProperty()
  @OneToMany(() => VideoHashtag, (hashtag) => hashtag.video)
  hashtags: VideoHashtag[];

  @IsNumber()
  @ApiProperty({ type: Number, description: '좋아요' })
  @Column({ type: 'int', default: 0 })
  likes: number;

  @IsNumber()
  @ApiProperty({ type: Number, description: '댓글' })
  @Column({ type: 'int', default: 0 })
  comments: number;
}
