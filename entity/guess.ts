import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatGameInfo } from "./chat-game-info";

@Entity()
export class Guess {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => ChatGameInfo, (chatInfo) => chatInfo.guesses)
  chatInfo: ChatGameInfo;

  @Column()
  username: string;

  @Column()
  text: string;
}
