import {
    IsString,
    IsNotEmpty,
    MaxLength,
    MinLength,
    IsOptional,
} from 'class-validator';

export class CreateCafeDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Name must be at least 6 characters long' })
    @MaxLength(10, { message: 'Name must not exceed 10 characters' })
    name!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(256, { message: 'Description must not exceed 256 characters' })
    description!: string;

    @IsString()
    @IsNotEmpty()
    location!: string;

    @IsOptional()
    @IsString()
    logo?: string;
}

export class UpdateCafeDto extends CreateCafeDto {}

export class CafeResponseDto {
    id!: string;
    name!: string;
    description!: string;
    logo?: string;
    location!: string;
    employees!: number;

    constructor(partial: Partial<CafeResponseDto>) {
        Object.assign(this, partial);
    }
}
