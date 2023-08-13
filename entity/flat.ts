import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Flat {
  @PrimaryColumn()
  id?: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  url: string;

  @Column("text", { array: true, nullable: true })
  images: string[];

  @Column({ nullable: true })
  price: string;
}
