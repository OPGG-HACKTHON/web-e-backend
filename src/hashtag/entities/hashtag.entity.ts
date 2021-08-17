import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Hashtag {
  @PrimaryColumn('varchar')
  hashtag: string;

  @Column({ type: 'int', default: 0 })
  cnt: number;
}
