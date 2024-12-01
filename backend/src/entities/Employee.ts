// src/entities/Employee.ts
import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Cafe } from './Cafe';

export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
}

@Entity('employees')
export class Employee {
    @PrimaryColumn({ length: 10 })
    id!: string;

    @Column({ length: 100 })
    name!: string;

    // @Column({ name: 'email_address', unique: true })
    // emailAddress!: string;
    @Column('varchar', { name: 'email_address' })
    emailAddress!: string;

    @Column({ name: 'phone_number', length: 8 })
    phoneNumber!: string;

    @Column({
        type: 'enum',
        enum: Gender,
    })
    gender!: Gender;

    @Column({ name: 'start_date' })
    startDate!: Date;

    @Column({ name: 'cafe_id', nullable: true })
    cafeId?: string;

    @ManyToOne(() => Cafe, (cafe) => cafe.employees, {
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'cafe_id' })
    cafe!: Cafe;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    constructor(partial: Partial<Employee> = {}) {
        Object.assign(this, partial);
    }
}
