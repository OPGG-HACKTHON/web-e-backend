import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { Hashtag } from './entities/hashtag.entity';

@Injectable()
export class HashtagService {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
  ) {}

  async create(createHashtagDto: CreateHashtagDto): Promise<Hashtag> {
    const hashtag = await this.hashtagRepository.create();
    hashtag.category = createHashtagDto.category;
    hashtag.hashtag = createHashtagDto.hashtag;
    return await this.hashtagRepository.save(hashtag);
  }

  async findAll(category: string): Promise<Hashtag[]> {
    const conditions = {};
    if (category) conditions['category'] = category;
    const ret = await this.hashtagRepository.find({
      where: conditions,
    });
    return ret;
  }

  async findOne(hashtag: string): Promise<Hashtag> {
    const ret = await this.hashtagRepository.findOneOrFail(hashtag);
    return ret;
  }

  async increaseCnt(hashtag: string): Promise<void> {
    const hashtagToUpdate = await this.hashtagRepository.findOne(hashtag);
    if (!hashtagToUpdate)
      throw new HttpException(`Hashtag ${hashtag} is none.`, 404);
    hashtagToUpdate.cnt++;
    await this.hashtagRepository.save(hashtagToUpdate);
  }

  async decreaseCnt(hashtag: string): Promise<void> {
    const hashtagToUpdate = await this.hashtagRepository.findOne(hashtag);
    if (!hashtagToUpdate)
      throw new HttpException(`Hashtag ${hashtag} is none.`, 404);
    if (hashtagToUpdate.cnt > 0) hashtagToUpdate.cnt--;
    await this.hashtagRepository.save(hashtagToUpdate);
  }

  async remove(hashtag: string): Promise<void> {
    const hashtagToDelete = await this.hashtagRepository.findOne(hashtag);
    if (!hashtagToDelete)
      throw new HttpException(`Hashtag ${hashtag} is none.`, 404);
    await this.hashtagRepository.delete(hashtag);
  }
}
