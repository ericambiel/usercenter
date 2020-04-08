import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../../models/auth';
import { map } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt'; // Ira verificar e decodificar o JWT enviado pelo rest
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly AUTH_URL = 'auth';
  private readonly LOGIN_PATH = '/login';
  private jwtHelper = new JwtHelperService();
  decodedToken: User;

  constructor(private httpClient: HttpClient) { }

  // ----------------
  // LOGIN, POST METHOD
  // ----------------
  /**
   * Ira logar o usuário no sistema e armazenar JWT
   * no navegador.
   * @param user Contem userName/Senha do usuário.
   */
  login(user: User) {
    // this.decodedToken = new User();
    return this.httpClient.post( `api/${this.AUTH_URL}${this.LOGIN_PATH}`, user).pipe(
      map((response: Auth) => {
        if (response.user.token) {
          localStorage.setItem('Bearer', response.user.token); // Armazena token no navegador
          // TODO: Retorno decodeToken esta sobrescrevendo objeto, não é possível acessar métodos do objeto após receber valores.
          this.decodedToken = this.jwtHelper.decodeToken(response.user.token);
        }
      })
    );
  }

  /** Verifica se Token esta expirado */
  isTokenExpired() {
    const token = localStorage.getItem('Bearer');
    return this.jwtHelper.isTokenExpired(token);
  }
}
