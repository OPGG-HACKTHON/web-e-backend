import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Game } from '../enums/game';

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
}
