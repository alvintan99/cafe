import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { Cafe } from "../entities/Cafe";
import { CreateCafeDto, UpdateCafeDto, CafeResponseDto } from "../dtos/cafe.dto";
import { AppError } from "../middlewares/error.handler";
import * as fs from "fs/promises";

export class CafeService {
    private cafeRepository: Repository<Cafe>;

    constructor() {
        this.cafeRepository = AppDataSource.getRepository(Cafe);
    }

    async findAll(location?: string): Promise<CafeResponseDto[]> {
        const queryBuilder = this.cafeRepository
            .createQueryBuilder("cafe")
            .leftJoinAndSelect("cafe.employees", "employee")
            .select([
                "cafe.id as cafe_id",
                "cafe.name as cafe_name",
                "cafe.description as cafe_description",
                "cafe.logo as cafe_logo",
                "cafe.location as cafe_location",
                "COUNT(DISTINCT employee.id) as employee_count"
            ])
            .groupBy("cafe.id, cafe.name, cafe.description, cafe.logo, cafe.location");

        if (location) {
            queryBuilder.where("cafe.location = :location", { location });
        }

        queryBuilder.orderBy("employee_count", "DESC");

        // Add debug logging
        // console.log('SQL Query:', queryBuilder.getSql());
        // console.log('Parameters:', queryBuilder.getParameters());

        const cafes = await queryBuilder.getRawMany();
        // console.log('Query Result:', cafes);

        return cafes.map(cafe => ({
            id: cafe.cafe_id,
            name: cafe.cafe_name,
            description: cafe.cafe_description,
            employees: parseInt(cafe.employee_count) || 0,
            logo: cafe.cafe_logo,
            location: cafe.cafe_location
        }));
    }

    // async findAll_ok(location?: string): Promise<CafeResponseDto[]> {
    //     try {
    //         const query = this.cafeRepository
    //             .createQueryBuilder('cafe')
    //             .select([
    //                 'cafe.id',
    //                 'cafe.name',
    //                 'cafe.description',
    //                 'cafe.logo',
    //                 'cafe.location'
    //             ])
    //             .addSelect(subQuery => {
    //                 return subQuery
    //                     .select('COUNT(DISTINCT employee.id)', 'count')
    //                     .from('employees', 'employee')
    //                     .where('employee.cafe_id = cafe.id');
    //             }, 'employee_count');
    
    //         if (location) {
    //             query.where('cafe.location = :location', { location });
    //         }
    
    //         query.orderBy('employee_count', 'DESC');
    
    //         // console.log('Generated SQL:', queryBuilder.getSql());
    
    //         const cafes = await query.getRawAndEntities();
    //         // console.log('Query Result:', cafes);
    
    //         return cafes.entities.map((cafe, index) => ({
    //             id: cafe.id,
    //             name: cafe.name,
    //             description: cafe.description,
    //             employees: parseInt(cafes.raw[index]?.employee_count || '0'),
    //             logo: cafe.logo,
    //             location: cafe.location
    //         }));
    //     } catch (error) {
    //         console.error('Error in findAll:', error);
    //         throw error;
    //     }
    // }

    async findById(id: string): Promise<Cafe | null> {
        return this.cafeRepository.findOne({
            where: { id },
            relations: ["employees"]
        });
    }

    async create(createCafeDto: CreateCafeDto, logoPath?: string): Promise<Cafe> {
        const cafe = this.cafeRepository.create({
            ...createCafeDto,
            logo: logoPath
        });
        return this.cafeRepository.save(cafe);
    }

    async update(id: string, updateCafeDto: UpdateCafeDto, logoPath?: string): Promise<Cafe> {
        const cafe = await this.findById(id);
        if (!cafe) {
            throw new AppError(404, "Cafe not found");
        }

        if (logoPath && cafe.logo) {
            try {
                await fs.unlink(cafe.logo);
            } catch (error) {
                console.error("Error deleting old logo:", error);
            }
        }

        this.cafeRepository.merge(cafe, {
            ...updateCafeDto,
            logo: logoPath || cafe.logo
        });

        return this.cafeRepository.save(cafe);
    }

    async delete(id: string): Promise<void> {
        const cafe = await this.findById(id);
        if (!cafe) {
            throw new AppError(404, "Cafe not found");
        }

        if (cafe.logo) {
            try {
                await fs.unlink(cafe.logo);
            } catch (error) {
                console.error("Error deleting logo:", error);
            }
        }

        await this.cafeRepository.remove(cafe);
    }
}