import { ApiProperty } from '@nestjs/swagger';
import { timestamp } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('follow')
export class Follow {
  @ApiProperty({ type: User, description: '나를 팔로우 하는 유저' })
  @ManyToOne(() => User, (user) => user.following, { primary: true })
  @JoinColumn({ name: 'followingId' })
  following: User;

  @ApiProperty({ type: User, description: '나를 팔로우 하는 유저' })
  @ManyToOne(() => User, (user) => user.followers, { primary: true })
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @ApiProperty({ type: timestamp, description: '팔로우 시작 시간' })
  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  createdAt: Date;
}
