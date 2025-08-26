import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  placa!: string;

  @Column()
  chassi!: string;

  @Column()
  renavam!: string;

  @Column()
  modelo!: string;

  @Column()
  marca!: string;

  @Column()
  ano!: number;
}
