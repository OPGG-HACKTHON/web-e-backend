import { Game } from 'src/videos/enums/game'; // Modify later
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Hashtag {
  @PrimaryColumn('varchar')
  hashtag: string;

  @Column({ type: 'enum', enum: Game })
  category: string;

  @Column({ type: 'int', default: 0 })
  cnt: number;
}
