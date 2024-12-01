import { Request, Response, NextFunction } from 'express';
import { validate as classValidate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export const validate = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoObj = plainToInstance(dtoClass, req.body);
        const errors = await classValidate(dtoObj);

        if (errors.length > 0) {
            next(errors);
        } else {
            req.body = dtoObj;
            next();
        }
    };
};
