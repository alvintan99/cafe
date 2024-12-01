import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Employee } from '../entities/Employee';
import {
    CreateEmployeeDto,
    UpdateEmployeeDto,
    EmployeeResponseDto,
} from '../dtos/employee.dto';
import { AppError } from '../middlewares/error.handler';

export class EmployeeService {
    private employeeRepository: Repository<Employee>;

    constructor() {
        this.employeeRepository = AppDataSource.getRepository(Employee);
    }

    private async checkExistingCafeAssignment(
        employeeId: string | undefined,
        cafeId: string | undefined,
        emailAddress: string
    ): Promise<void> {
        if (!cafeId) return;

        const query = this.employeeRepository
            .createQueryBuilder('employee')
            .where('employee.emailAddress = :emailAddress', { emailAddress });

        if (employeeId) {
            query.andWhere('employee.id != :employeeId', { employeeId });
        }

        const existingEmployee = await query.getOne();

        if (existingEmployee && existingEmployee.cafeId) {
            throw new AppError(
                400,
                'This employee is already assigned to another cafe. An employee cannot work in multiple cafes simultaneously.'
            );
        }
    }

    async findAll(cafeId?: string): Promise<EmployeeResponseDto[]> {
        const query = this.employeeRepository
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.cafe', 'cafe')
            .select([
                'employee.id as id',
                'employee.name as name',
                'employee.emailAddress as email_address',
                'employee.phoneNumber as phone_number',
                'EXTRACT(DAY FROM (CURRENT_TIMESTAMP - employee.startDate))::integer as days_worked',
                'cafe.name as cafe'
            ]);

        if (cafeId) {
            query.where('employee.cafeId = :cafeId', { cafeId });
        }

        query.orderBy('days_worked', 'DESC');

        const results = await query.getRawMany();

        return results.map(result => new EmployeeResponseDto({
            id: result.id,
            name: result.name,
            email_address: result.email_address,
            phone_number: result.phone_number,
            days_worked: result.days_worked,
            cafe: result.cafe || ''
        }));
    }

    async findById(id: string): Promise<Employee | null> {
        return this.employeeRepository.findOne({
            where: { id },
            relations: ['cafe'],
        });
    }

    async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        await this.checkExistingCafeAssignment(
            undefined,
            createEmployeeDto.cafeId,
            createEmployeeDto.emailAddress
        );

        const id = 'UI' + Math.random().toString(36).substr(2, 7).toUpperCase();

        const employee = this.employeeRepository.create({
            ...createEmployeeDto,
            id,
            startDate: new Date(),
        });

        return this.employeeRepository.save(employee);
    }

    async update(
        id: string,
        updateEmployeeDto: UpdateEmployeeDto
    ): Promise<Employee> {
        const employee = await this.findById(id);
        if (!employee) {
            throw new AppError(404, 'Employee not found');
        }

        await this.checkExistingCafeAssignment(
            id,
            updateEmployeeDto.cafeId,
            updateEmployeeDto.emailAddress || employee.emailAddress
        );

        this.employeeRepository.merge(employee, updateEmployeeDto);
        return this.employeeRepository.save(employee);
    }

    async delete(id: string): Promise<void> {
        const employee = await this.findById(id);
        if (!employee) {
            throw new AppError(404, 'Employee not found');
        }

        await this.employeeRepository.remove(employee);
    }
}