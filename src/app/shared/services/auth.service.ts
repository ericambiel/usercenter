import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../models/auth';
import { map } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt'; // Ira verificar e decodificar o JWT enviado pelo rest
import { User } from '../../models/user';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly AUTH_URL = 'auth';
  private readonly LOGIN_PATH = '/login';
  private readonly LDAP_CHECK_PATH = '/ldap_status';
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
    return this.httpClient.post( `api/${this.AUTH_URL}${this.LOGIN_PATH}`, user)
      .pipe(
        map((response: Auth) => {
          if (response.user.token) {
            localStorage.setItem('Bearer', response.user.token); // Armazena token no navegador
            // TODO: Retorno decodeToken esta sobrescrevendo objeto, não é possível acessar métodos do objeto após receber valores.
            this.decodedToken = this.jwtHelper.decodeToken(response.user.token);
          }
        })
      );
  }

  /**
   * Checa estado do servidor LDAP Remoto
   */
  checkLDAPStatus() {
    return this.httpClient.get(`api/${this.AUTH_URL}${this.LDAP_CHECK_PATH}`)
      .pipe(map((response: any) => {
        return response; })
      );
  }

  /** Verifica se Token esta expirado */
  isTokenExpired() {
    const token = localStorage.getItem('Bearer');
    return this.jwtHelper.isTokenExpired(token);
  }

  // TODO
  // /** Obtém login via NTLM */
  // getCurrentUser(): Observable<any> {
  //   const options = {
  //     headers : {'Content-Type': 'application/json'},
  //     withCredentials: true };
  //   return this.httpClient.get(`api/${this.AUTH_URL}${this.LOGIN_PATH}`, options)
  //   .pipe(
  //     map((response: any) => response.json())
  //   );
  // }
}
