import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export function validateDto<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const source = { ...req.body, ...req.query, ...req.params };

    const dto = plainToInstance(dtoClass, source, {
      enableImplicitConversion: true, // auto-convert query strings to numbers/booleans
    });
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors
        .map((err) => (err.constraints ? Object.values(err.constraints) : 'Validation error'))
        .flat();
      throw new AppError(messages.join(', '), 400);
    }
    next();
  };
}
