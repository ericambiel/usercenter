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
      catchError(error => {
        if (typeof error.error.message === 'string') {
          switch (true) {
            case error.status >= 500 : this.alert.danger(error.error.message); break;
            case error.status >= 400 : this.alert.warning(error.error.message); break;
          }
        } else {
          switch (true) {
            case error.status === 403 : this.alert.warning('Você não tem autorização para acessar esse modulo'); break;
            case error.status >= 500 : this.alert.danger('Ocorreu um erro interno, contate o administrador'); break;
          }
        }
        return throwError(error);
      })
    );
  }
}
