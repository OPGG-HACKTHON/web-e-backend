import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity'
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videosRepository: Repository<Video>,
  ) {}

  create(createVideoDto: CreateVideoDto): Promise<Video> {
    if (!createVideoDto.userId) throw new HttpException('There is not userId in request body.', 400);
    if (!createVideoDto.name) throw new HttpException('There is not name in request body.', 400);
    if (!createVideoDto.game) throw new HttpException('There is not game in request body.', 400);
    if (!createVideoDto.url) throw new HttpException('There is not url in request body.', 400);
    const video = this.videosRepository.create();
    video.userId = createVideoDto.userId;
    video.name = createVideoDto.name;
    if (video.game < 0 || video.game > 2) throw new HttpException('Invalid game number.', 400);
    video.game = createVideoDto.game;
    video.url = createVideoDto.url;
    if (createVideoDto.description) video.description = createVideoDto.description;
    return this.videosRepository.save(video);
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
    if (video.game < 0 || video.game > 2) throw new HttpException('Invalid game number.', 400);
    await this.videosRepository.update(id, updateVideoDto);
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) throw new HttpException('Id must be a nubmer.', 400);
    const video = await this.videosRepository.findOne(id);
    if (!video) throw new HttpException(`Video with id ${id} is none.`, 404);
    await this.videosRepository.delete(id);
  }
}