import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor() { }

  /**
   * Ira interceptar todos os erros de resposta de um verbo HTTP.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error) => {
        console.log('error is intercept');
        // console.error(error);
        return throwError(error.message);
      })
    );
  }
}
