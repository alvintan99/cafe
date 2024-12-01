import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/employee.service';
import { AppError } from '../middlewares/error.handler';

export class EmployeeController {
    private employeeService: EmployeeService;

    constructor() {
        this.employeeService = new EmployeeService();
    }

    getEmployees = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { cafe } = req.query;
            const employees = await this.employeeService.findAll(
                cafe as string
            );
            res.json(employees);
        } catch (error) {
            next(error);
        }
    };

    getEmployeeById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const employee = await this.employeeService.findById(req.params.id);
            if (!employee) {
                throw new AppError(404, 'Employee not found');
            }
            res.json(employee);
        } catch (error) {
            next(error);
        }
    };

    createEmployee = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const employee = await this.employeeService.create(req.body);
            res.status(201).json(employee);
        } catch (error) {
            next(error);
        }
    };

    updateEmployee = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const employee = await this.employeeService.update(
                req.params.id,
                req.body
            );
            res.json(employee);
        } catch (error) {
            next(error);
        }
    };

    deleteEmployee = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await this.employeeService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
