import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class FormEntityBase {
  @PrimaryGeneratedColumn()
  _id: number;
}
