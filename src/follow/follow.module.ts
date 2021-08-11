import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Follow } from './entities/follow.entity';
import { FollowService } from './follow.service';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User]), UsersModule],
  providers: [FollowService],
  exports: [FollowService],
})
export class FollowModule {}
