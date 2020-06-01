import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { LDAPUserAD } from '../../../models/ldapUserAD';
import { User } from '../../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'user';
  private readonly LDAP_AD_USERS = '/ldap_ad_users';
  private readonly GET_MYSELF = '/myself';

  public dialogData;
  constructor(private httpClient: HttpClient) { }

  /**
   * Retorna usuários do Microsoft AD em um server LDAP.
   */
  getUserAD() {
    return this.httpClient.get<LDAPUserAD[]>(`api/${this.API_URL}${this.LDAP_AD_USERS}`)
    .pipe(
      map((response: LDAPUserAD[]) => {
          return response;
        })
    );
  }

  /**
   * Listar todos os Usuário
   */
  getAllUsers() {
    return this.httpClient.get<LDAPUserAD[]>(`api/${this.API_URL}`)
    .pipe(
      map((response: LDAPUserAD[]) => {
          return response;
        })
    );
  }

  /**
   * Listar usuário (Ele mesmo)
   */
  getMySelf() {
    return this.httpClient.get<LDAPUserAD[]>(`api/${this.API_URL}${this.GET_MYSELF}`)
    .pipe(
      map((response: LDAPUserAD[]) => {
          return response;
        })
    );
  }

  /**
   * Insere novo usuário ao BD
   */
  insertUser(user: User) {
    this.dialogData = user;

    return this.httpClient.post(`api/${this.API_URL}`, user)
      .pipe(
        map((response: User) => {
          return response;
        })
      );
  }

  /**
   * Atualiza usuário.
   * @param user Usuário a ser atualizado.
   */
  updateUser(user: User) {
    this.dialogData = user;

    return this.httpClient.patch(`api/${this.API_URL}/${user._id}`, user).pipe(
      map((response: User) => {
        return response;
      })
    );
  }

  /**
   * Deletar usuário
   */
  deleteUser(_id: string) {
    return this.httpClient.delete(`api/${this.API_URL}/${_id}`)
      .pipe(
        map((response: User) => {
          return response;
        })
      );
  }

}
