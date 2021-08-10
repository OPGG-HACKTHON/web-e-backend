import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('follow')
export class Follow {
  @ManyToOne(() => User, (user) => user.following, { primary: true })
  @JoinColumn({ name: 'followingId' })
  following: User;

  @ManyToOne(() => User, (user) => user.followers, { primary: true })
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  createdAt: Date;
}
