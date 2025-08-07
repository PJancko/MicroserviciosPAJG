import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Agenda {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombres!: string;

  @Column()
  apellidos!: string;

  @Column({ type: "date", nullable: true })
  fecha_nacimiento?: Date;

  @Column()
  direccion!: string;

  @Column()
  celular!: string;

  @Column()
  correo!: string;
}
