import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { upload } from '../middlewares/upload.middleware';
import { CafeController } from '../controllers/cafe.controller';
import { CreateCafeDto, UpdateCafeDto } from '../dtos/cafe.dto';

const router = Router();
const cafeController = new CafeController();

// GET /cafes
router.get('/', cafeController.getCafes);

// GET /cafes/:id
router.get('/:id', cafeController.getCafeById);

// POST /cafes
router.post(
    '/',
    upload.single('logo'),
    validate(CreateCafeDto),
    cafeController.createCafe
);

// PUT /cafes/:id
router.put(
    '/:id',
    upload.single('logo'),
    validate(UpdateCafeDto),
    cafeController.updateCafe
);

// DELETE /cafes/:id
router.delete('/:id', cafeController.deleteCafe);

export default router;