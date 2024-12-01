import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { EmployeeController } from '../controllers/employee.controller';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dtos/employee.dto';

const router = Router();
const employeeController = new EmployeeController();

// GET /employees
router.get('/', employeeController.getEmployees);

// GET /employees/:id
router.get('/:id', employeeController.getEmployeeById);

// POST /employee
router.post(
    '/',
    validate(CreateEmployeeDto),
    employeeController.createEmployee
);

// PUT /employee/:id
router.put(
    '/:id',
    validate(UpdateEmployeeDto),
    employeeController.updateEmployee
);

// DELETE /employee/:id
router.delete('/:id', employeeController.deleteEmployee);

export default router;
