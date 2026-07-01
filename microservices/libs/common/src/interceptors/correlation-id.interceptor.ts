import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

/**
 * Propaga (o genera) un `correlationId` por request HTTP.
 * Lo deja disponible en `req.correlationId` y lo devuelve en el header de respuesta,
 * para correlacionar la petición con los eventos que dispare aguas abajo.
 */
@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();

    const correlationId =
      (request.headers?.[CORRELATION_ID_HEADER] as string) ?? randomUUID();

    request.correlationId = correlationId;
    response.setHeader(CORRELATION_ID_HEADER, correlationId);

    return next.handle();
  }
}
