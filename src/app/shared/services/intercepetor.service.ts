import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AlertService } from 'ngx-alerts'; // Alertas para usuário

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private alert: AlertService) { }

  /**
   * Ira interceptar requisições HTTP.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && typeof event.body.message === 'string') {
          this.alert.info(event.body.message);
        }
        return event;
      }),
      catchError((error) => {
        if (typeof error.error.message === 'string') {
          this.alert.warning(error.error.message);
        } else if (error.status === 403) {
          this.alert.warning('Você não tem autorização para acessar esse modulo');
        } else if (error.status >= 500 && typeof error.error.message !== 'string') {
          this.alert.danger('Um erro de processamento interno ocorreu contate o ADM');
        }
        return throwError(error);
      })
    );
  }
}
