import { HttpException } from "@/exceptions/HttpException";
import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    try {
      let status: number = error.status || 500;
      let message: string = error.message || 'Something went wrong';
  
      res.status(status).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack })
    });
    } catch (innerError) {
      next(innerError);
    }
  };