import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Guess } from "./guess";

@Entity()
export class GuessWordGameInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatId: number;

  @Column("text", { array: true })
  participants: string[] = [];

  @OneToMany(() => Guess, (guess) => guess.gameInfo)
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
