import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Guess } from "./guess";

@Entity()
export class ChatGameInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatId: number;

  @Column("text", { array: true })
  participants: string[] = [];

  @OneToMany(() => Guess, (guess) => guess)
  guesses: Guess[] = [];

  @Column()
  wordToGuess?: string;

  @Column()
  question?: string;

  @Column()
  gameMessageId?: number;

  @Column()
  isFinished: boolean = false;
}
