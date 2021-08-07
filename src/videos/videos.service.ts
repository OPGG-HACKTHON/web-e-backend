import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

import { User } from 'src/users/entities/user.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Video)
    private readonly videosRepository: Repository<Video>,
  ) {}

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    if (!createVideoDto.hasOwnProperty('userId'))
      throw new HttpException('There is not userId in request body.', 400);
    if (!createVideoDto.hasOwnProperty('name'))
      throw new HttpException('There is not name in request body.', 400);
    if (!createVideoDto.hasOwnProperty('game'))
      throw new HttpException('There is not game in request body.', 400);
    if (!createVideoDto.hasOwnProperty('url'))
      throw new HttpException('There is not url in request body.', 400);
    const video = this.videosRepository.create();
    const user = await this.usersRepository.findOne(createVideoDto.userId);
    video.user = user;
    video.name = createVideoDto.name;
    video.game = createVideoDto.game;
    video.url = createVideoDto.url;
    if (createVideoDto.description)
      video.description = createVideoDto.description;
    return await this.videosRepository.save(video);
  }

  async findAll(): Promise<Video[]> {
    const videos = await this.videosRepository.find();
    return videos;
  }

  async findOne(id: number): Promise<Video> {
    if (isNaN(id)) throw new HttpException('Id must be a nubmer.', 400);
    const video = await this.videosRepository.findOne(id);
    if (!video) throw new HttpException(`Video with id ${id} is none.`, 404);
    return video;
  }

  async update(id: number, updateVideoDto: UpdateVideoDto): Promise<void> {
    if (isNaN(id)) throw new HttpException('Id must be a nubmer.', 400);
    const video = await this.videosRepository.findOne(id);
    if (!video) throw new HttpException(`Video with id ${id} is none.`, 404);
    await this.videosRepository.update(id, updateVideoDto);
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) throw new HttpException('Id must be a nubmer.', 400);
    const video = await this.videosRepository.findOne(id);
    if (!video) throw new HttpException(`Video with id ${id} is none.`, 404);
    await this.videosRepository.delete(id);
  }
}