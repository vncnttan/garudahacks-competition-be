import { JWT_SECRET } from '@/config';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { serviceInjector } from '@/utils/serviceInjector';
import { HttpException } from '@exceptions/HttpException';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.header('Authorization');
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split('Bearer ')[1];
      const secretKey: string = JWT_SECRET;

      const verifiedUserId = (await verify(token, secretKey)) as { id: string };

      const findUser = await serviceInjector.userService.findUserById(verifiedUserId.id);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'You are logged out please signin again'));
      }
    } else {
      next(new HttpException(401, 'Authorization header missing or invalid'));
    }
  } catch (error) {
    next(new HttpException(401, 'You are logged out please signin again'));
  }
};

export default authMiddleware;
