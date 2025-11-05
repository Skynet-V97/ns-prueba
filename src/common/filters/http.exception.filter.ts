import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error'; // Mensaje por defecto

    if (exception instanceof Error) {
      // Verifica si el error es el de "Converting circular structure to JSON"
      if (exception.message.includes('Converting circular structure to JSON')) {
        message = 'Insertado con éxito, pero falla al cargar el JSON';
      }
    }

    // Aquí modificamos para ocultar 'statusCode' si no lo deseas en la respuesta
    response.status(status).json({
      message: message,
    });
  }
}
