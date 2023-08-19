import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GuessWordGameInfo } from "./chat-game-info";

@Entity()
export class Guess {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => GuessWordGameInfo, (chatInfo) => chatInfo.guesses)
  gameInfo: GuessWordGameInfo;

  @Column()
  username: string;

  @Column()
  text: string;
}
