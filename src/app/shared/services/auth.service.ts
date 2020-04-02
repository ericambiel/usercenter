import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../../models/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly AUTH_URL = 'auth';
  private readonly LOGIN_PATH = '/login';

  constructor(private httpClient: HttpClient) { }

  // ----------------
  // LOGIN, POST METHOD
  // ----------------
  login(auth: Auth) {
    return this.httpClient.post( `api/${this.AUTH_URL}${this.LOGIN_PATH}`, auth).pipe(
      map((response: Auth) => {
        if (response.user.token) {
          localStorage.setItem('token', response.user.token); // Armazena token no navegador
        }
      })
    );
  }
}
