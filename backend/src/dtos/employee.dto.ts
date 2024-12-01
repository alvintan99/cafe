import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsEnum,
    Matches,
    IsOptional,
    IsUUID,
    MinLength,
    MaxLength,
} from 'class-validator';
import { Gender } from '../entities/Employee';

export class CreateEmployeeDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(10)
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    emailAddress!: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[89]\d{7}$/, {
        message: 'Phone number must start with 8 or 9 and have 8 digits',
    })
    phoneNumber!: string;

    @IsEnum(Gender)
    gender!: Gender;

    @IsOptional()
    @IsUUID()
    cafeId?: string;
}

export class UpdateEmployeeDto extends CreateEmployeeDto {}

export class EmployeeResponseDto {
    id!: string;
    name!: string;
    email_address!: string;
    phone_number!: string;
    days_worked!: number;
    cafe?: string;

    constructor(partial: Partial<EmployeeResponseDto>) {
        Object.assign(this, partial);
    }
}
