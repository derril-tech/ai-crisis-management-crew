import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ProblemJsonFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let type = 'https://tools.ietf.org/html/rfc7231#section-6.6.1';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        message = Array.isArray(exceptionResponse.message) 
          ? exceptionResponse.message[0] 
          : exceptionResponse.message;
      } else {
        message = exception.message;
      }

      // Map HTTP status codes to appropriate problem types
      switch (status) {
        case 400:
          type = 'https://tools.ietf.org/html/rfc7231#section-6.5.1';
          break;
        case 401:
          type = 'https://tools.ietf.org/html/rfc7235#section-3.1';
          break;
        case 403:
          type = 'https://tools.ietf.org/html/rfc7231#section-6.5.3';
          break;
        case 404:
          type = 'https://tools.ietf.org/html/rfc7231#section-6.5.4';
          break;
        case 409:
          type = 'https://tools.ietf.org/html/rfc7231#section-6.5.8';
          break;
        case 422:
          type = 'https://tools.ietf.org/html/rfc4918#section-11.2';
          break;
        case 429:
          type = 'https://tools.ietf.org/html/rfc6585#section-4';
          break;
        case 500:
          type = 'https://tools.ietf.org/html/rfc7231#section-6.6.1';
          break;
        default:
          type = 'https://tools.ietf.org/html/rfc7231#section-6.6.1';
      }
    }

    const problemJson = {
      type,
      title: this.getTitle(status),
      status,
      detail: message,
      instance: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(problemJson);
  }

  private getTitle(status: number): string {
    switch (status) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      case 409:
        return 'Conflict';
      case 422:
        return 'Unprocessable Entity';
      case 429:
        return 'Too Many Requests';
      case 500:
        return 'Internal Server Error';
      default:
        return 'Error';
    }
  }
}
