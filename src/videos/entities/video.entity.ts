import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Game } from '../enums/game';
import { ApiProperty } from '@nestjs/swagger';
import { VideoLike } from 'src/video-like/entities/video-like.entity';

@Entity()
export class Video {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.videos)
  user: User;

  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @IsDate()
  @UpdateDateColumn()
  updatedAt: Date;

  @IsString()
  @Column()
  name: string;

  @IsEnum(Game)
  @Column({ type: 'enum', enum: Game })
  game: number;

  @IsString()
  @Column('varchar')
  url: string;

  @IsString()
  @Column({ type: 'varchar', default: '' })
  description: string;

  @IsNumber()
  @Column({ type: 'int', default: 0 })
  comments: number;

  @IsNumber()
  @Column({ type: 'int', default: 0 })
  views: number;

  @IsNumber()
  @Column({ type: 'int', default: 0 })
  likes: number;

  @ApiProperty({ type: VideoLike, description: '비디오 좋아요 당하는 비디오' })
  @OneToMany(() => VideoLike, (videoLike) => videoLike.likedVideo)
  likedVideo: VideoLike[];
}
