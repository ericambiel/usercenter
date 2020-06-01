import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LDAPService } from '../../services/ldap.service';
import { LDAPDataSource } from './ldap-user.data.source';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-ldap-users',
  templateUrl: './ldap-users.component.html',
  styleUrls: ['./ldap-users.component.scss']
})
export class LdapUsersComponent implements OnInit {

  LDAPDatabase: LDAPService | null;
  LDAPDataSource: LDAPDataSource | null; // Dados em memória da Tabela

  _id: string; // Caso remova um ativo, usar para atualizar a tabela.

  // Colunas que serão exibidas na tabela
  displayedColumns = [ 'objectGUID',
                       'objectSid',
                       'cn',
                       'sn',
                       'givenName',
                       'sAMAccountName',
                       'userPrincipalName',
                       'displayName',
                       'mail',
                      //  'memberOf',
                       'lastLogon',
                       'whenCreated',
                       'whenChanged',
                       'userAccountControl' ];

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public inventoryService: LDAPService) { }

  // ViewChildren que acessão propriedades no HTML da tabela na aplicação
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('filter',  {static: true}) filter: ElementRef;

  /** Carrega dados na inicialização desse componente */
  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Carrega objeto com Ativos
   */
  loadData() {
    // this.dataAsset = new Inventory(); // TODO: Verificar se isso aqui esta certo aqui.
    this.LDAPDatabase = new LDAPService(this.httpClient);
    // Toda vez q é atualizado tambem atualiza mat-table em app.component.html através dos propertyBind
    this.LDAPDataSource = new LDAPDataSource(this.LDAPDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.LDAPDataSource) {
          return;
        }
        this.LDAPDataSource.filter = this.filter.nativeElement.value;
      });
  }
}
