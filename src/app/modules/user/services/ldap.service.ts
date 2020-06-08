import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { LDAPUserAD } from '../../../models/ldapUserAD';

@Injectable({
  providedIn: 'root'
})

export class LDAPService {
  private readonly API_URL = 'users';
  private readonly LDAP_AD_USERS = '/ldap_ad_users';
  private readonly LDAP_CHECK_PATH = '/ldap_status';

  // Objeto com contratos, ouve mudanças em qualquer lugar da aplicação que o estiver usando.
  dataChange: BehaviorSubject<LDAPUserAD[]> = new BehaviorSubject<LDAPUserAD[]>([]);

  get data(): LDAPUserAD[] {
    return this.dataChange.value;
  }


  // public dialogData;

  constructor(private httpClient: HttpClient) { }

  /**
   * Retorna usuários do Microsoft AD em um server LDAP.
   */
  getAllUsersAD() {
    this.httpClient.get(`api/${this.API_URL}${this.LDAP_AD_USERS}`)
      .pipe(
        map((response: [LDAPUserAD]) => {
          const userADArray = new Array<LDAPUserAD>();
          response.map(userAD =>
            userADArray.push(new LDAPUserAD().fromObject(userAD))
          );
          return userADArray;
        }
      ))
      .subscribe(userADArray => {
        this.dataChange.next(userADArray);
      });
  }

  // TODO: remover de serviço Auth e migra para este endpoint.
  /**
   * Checa estado do servidor LDAP Remoto
   */
  checkLDAPStatus() {
    return this.httpClient.get(`api/${this.API_URL}${this.LDAP_CHECK_PATH}`)
      .pipe(map((response: any) => {
        return response; })
      );
  }

}
