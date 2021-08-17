import { Video } from 'src/videos/entities/video.entity';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class VideoHashtag {
  @PrimaryColumn('varchar')
  hashtag: string;

  @ManyToOne((type) => Video, (video) => video.hashtags)
  video: Video;
}
