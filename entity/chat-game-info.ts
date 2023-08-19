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

  @OneToMany(() => Guess, (guess) => guess.chatInfo)
  guesses: Guess[];

  @Column({ nullable: true })
  wordToGuess?: string;

  @Column({ nullable: true })
  question?: string;

  @Column({ nullable: true })
  gameMessageId?: number;

  @Column({ default: false })
  isFinished: boolean = false;
}
