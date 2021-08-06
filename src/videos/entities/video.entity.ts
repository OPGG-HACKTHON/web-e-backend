import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

enum Game {
  League_of_Legends,
  Overwatch,
  PUBG_BATTLEGROUNDS
}

@Entity()
export class Video {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column('varchar')
  userId: string;

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
  @Column({ type: 'varchar', default: "" })
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