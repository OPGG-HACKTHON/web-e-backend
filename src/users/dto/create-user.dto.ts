import { IsNumber, IsString } from 'class-validator';
export class CreateUserDto {
  //코드 간결하게 만들어주며, validation을 제공해 줄 수 있다
  @IsString()
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsNumber()
  readonly age: number;
  // @IsString({ each: true }) //각각 검사.
  // readonly genres: string[];
}
