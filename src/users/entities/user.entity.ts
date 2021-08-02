import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
// import { movie } from '../movie/movie.entity';

@Entity('USER')
export class User {
  @ApiProperty({ type: String, description: '로그인 ID' })
  @PrimaryColumn()
  userId: string;
  @ApiProperty({ type: String, description: '유저명' })
  @Column()
  userName: string;
  @ApiProperty({ type: String, description: '사용자 비밀번호' })
  @Column()
  userPassword: string;
  @ApiProperty({ type: String, description: '사용자프로필' })
  @Column()
  userPhoto: string;
  @ApiProperty({ type: String, description: '사용자 이메일' })
  @Column({ type: 'varchar', unique: true })
  userEmail: string;
  @ApiProperty({ type: String, description: '사용자 성별' })
  @Column()
  userGender: string;

  //   @OneToMany(() => Movie, (Movie) => Movie.user)
  //   movies: Movie[];
}
