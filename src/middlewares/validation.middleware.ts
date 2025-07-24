import { HttpException } from '@exceptions/HttpException';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';

const getErrorMessages = (error: ValidationError, messages: string[]) => {
  if (error.constraints) {
    const errorMessages = Object.values(error.constraints);
    for (const errorMessage of errorMessages) {
      messages.push(errorMessage);
    }
  }
  if (error.children) {
    for (const child of error.children) {
      getErrorMessages(child, messages);
    }
  }
};

const validationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req, res, next) => {
    validate(plainToInstance(type, req[value]), { skipMissingProperties, whitelist, forbidNonWhitelisted }).then((errors: ValidationError[]) => {
        console.log(errors)
      if (errors.length > 0) {
        const messages: string[] = [];
        for (const error of errors) {
          getErrorMessages(error, messages);
        }
        const message = messages.join(', ');
        next(new HttpException(400, message));
      } else {
        next();
      }
    });
  };
};

export default validationMiddleware;
