import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Url {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    urlCode: string;

    @Column()
    longUrl: string;

    @Column({ default: 0 })
    visits: number;

    @Column({ type: 'datetime' })
    creationDate: Date;

    @Column('simple-json')
    clicksByDate: { [key: string]: number };
}