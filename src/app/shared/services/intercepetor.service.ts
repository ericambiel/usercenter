import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import { AlertService } from 'ngx-alerts'; // Alertas para usuário

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private alert: AlertService) { }

  /**
   * Ira interceptar todos os erros de resposta de um verbo HTTP.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        // console.error(error);
        if (error.status >= 500) {
          this.alert.danger('Um erro de processamento interno ocorreu contate o ADM');
        } else {
          this.alert.warning(error.error.errorMessage);
        }
        return throwError(error);
      })
    );
  }
}
