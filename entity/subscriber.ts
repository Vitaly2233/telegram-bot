import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  chatId: number;
}
