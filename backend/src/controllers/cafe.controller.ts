import { Request, Response, NextFunction } from 'express';
import { CafeService } from '../services/cafe.service';
import { AppError } from '../middlewares/error.handler';

export class CafeController {
    private cafeService: CafeService;

    constructor() {
        this.cafeService = new CafeService();
    }

    getCafes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { location } = req.query;
            const cafes = await this.cafeService.findAll(location as string);
            res.json(cafes);
        } catch (error) {
            next(error);
        }
    };

    getCafeById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cafe = await this.cafeService.findById(req.params.id);
            if (!cafe) {
                throw new AppError(404, 'Cafe not found');
            }
            res.json(cafe);
        } catch (error) {
            next(error);
        }
    };

    createCafe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const logoPath = req.file?.path;
            const cafe = await this.cafeService.create(req.body, logoPath);
            res.status(201).json(cafe);
        } catch (error) {
            next(error);
        }
    };

    updateCafe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const logoPath = req.file?.path;
            const cafe = await this.cafeService.update(
                req.params.id,
                req.body,
                logoPath
            );
            res.json(cafe);
        } catch (error) {
            next(error);
        }
    };

    deleteCafe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.cafeService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
