import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Employee } from './Employee';

@Entity('cafes')
export class Cafe {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 100 })
    name!: string;

    @Column('text')
    description!: string;

    @Column({ nullable: true })
    logo?: string;

    @Column()
    location!: string;

    @OneToMany(() => Employee, (employee) => employee.cafe)
    employees!: Employee[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    constructor(partial: Partial<Cafe> = {}) {
        Object.assign(this, partial);
    }
}
