import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SuperheroEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  nickname: string;

  @Column({ name: "real_name" })
  realName: string;

  @Column({ name: "origin_description", type: "text" })
  originDescription: string;

  @Column("simple-array")
  superpowers: string[];

  @Column({ name: "catch_phrase", type: "text" })
  catchPhrase: string;

  @Column({ type: "text", default: "" })
  images: string; // Зберігаємо як рядок (CSV формат)

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
