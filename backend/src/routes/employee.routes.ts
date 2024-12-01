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

// POST /employees
router.post(
    '/',
    validate(CreateEmployeeDto),
    employeeController.createEmployee
);

// PUT /employees/:id
router.put(
    '/:id',
    validate(UpdateEmployeeDto),
    employeeController.updateEmployee
);

// DELETE /employees/:id
router.delete('/:id', employeeController.deleteEmployee);

export default router;
