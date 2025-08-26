import { Entity, ObjectIdColumn, Column, ObjectId } from "typeorm";

@Entity()
export class Agenda {
  @ObjectIdColumn()
  _id!: ObjectId; // tipo correcto para TypeORM + MongoDB

  @Column()
  nombres!: string;

  @Column()
  apellidos!: string;

  @Column({ nullable: true })
  fecha_nacimiento?: Date;

  @Column()
  direccion!: string;

  @Column()
  celular!: string;

  @Column()
  correo!: string;
}
