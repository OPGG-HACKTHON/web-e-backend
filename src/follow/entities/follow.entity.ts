import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { timestamp } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('follow')
export class Follow {
  // userId and followingId is Primary Key
  @IsString()
  @ApiProperty({ type: User, description: '팔로우 요청하는 사람' })
  @PrimaryColumn({ name: 'userId' })
  userId: string;

  @IsString()
  @ApiProperty({ type: User, description: '팔로우 받는 사람' })
  @PrimaryColumn({ name: 'followingId' })
  followingId: string;

  @ManyToOne(() => User, (user) => user.user)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'followingId' })
  following: User;

  @ApiProperty({ type: timestamp, description: '팔로우 시작 시간' })
  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  createdAt: Date;
}
