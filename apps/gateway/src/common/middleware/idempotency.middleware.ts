import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  constructor(
    // TODO: Add idempotency key repository
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const idempotencyKey = req.headers['idempotency-key'] as string;
    
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      if (!idempotencyKey) {
        throw new HttpException(
          {
            type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
            title: 'Bad Request',
            detail: 'Idempotency-Key header is required for this operation',
            status: 400,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // TODO: Check if key already exists and return cached response
      // For now, just validate the key format
      if (idempotencyKey.length < 1 || idempotencyKey.length > 255) {
        throw new HttpException(
          {
            type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
            title: 'Bad Request',
            detail: 'Idempotency-Key must be between 1 and 255 characters',
            status: 400,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    next();
  }
}
