
import { LDAPUserAD } from '../../../../models/ldapUserAD';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { LDAPService } from '../../services/ldap.service';

export class LDAPDataSource extends DataSource<LDAPUserAD> {
  filterChange = new BehaviorSubject('');

  get filter(): string {
    return this.filterChange.value;
  }

  set filter(filter: string) {
    this.filterChange.next(filter);
  }

  filteredData: LDAPUserAD[] = [];
  renderedData: LDAPUserAD[] = [];

  constructor(public ldapDatabase: LDAPService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<LDAPUserAD[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.ldapDatabase.dataChange,
      this.sort.sortChange,
      this.filterChange,
      this.paginator.page
    ];

    this.ldapDatabase.getAllUsersAD();

    return merge(...displayDataChanges).pipe(map( () => {
        // Filter data
        this.filteredData = this.ldapDatabase.data.slice().filter((ldapUserAd: LDAPUserAD) => {
          // searchStr recebe campos do objeto contrato que serão usados para serem filtrados.
          const searchStr = ( ldapUserAd.objectGUID +
                              ldapUserAd.objectSid +
                              ldapUserAd.cn +
                              ldapUserAd.sn +
                              ldapUserAd.givenName +
                              ldapUserAd.sAMAccountName +
                              ldapUserAd.userPrincipalName +
                              ldapUserAd.displayName +
                              ldapUserAd.mail +
                              // ldapUserAd.memberOf +
                              ldapUserAd.lastLogon +
                              ldapUserAd.whenCreated +
                              ldapUserAd.whenChanged +
                              ldapUserAd.userAccountControl).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());

        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this.paginator.pageSize);
        return this.renderedData;
      }
    ));
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(dataContrato: LDAPUserAD[]): LDAPUserAD[] {
    if (!this.sort.active || this.sort.direction === '') {
      return dataContrato;
    }

    return dataContrato.sort((a, b) => {
      let propertyA: number | Date | string = '';
      let propertyB: number | Date | string = '';
      // Campos que seram usados para ordenação;
      switch (this.sort.active) {
        case '_id': [propertyA, propertyB] = [a.objectGUID, b.objectGUID]; break;
        case 'id': [propertyA, propertyB] = [a.objectSid, b.objectSid]; break;
        case 'assetNum': [propertyA, propertyB] = [a.cn, b.cn]; break;
        case 'subAssetNum' : [propertyA, propertyB] = [a.sn, b.sn]; break;
        case 'class' : [propertyA, propertyB] = [a.givenName, b.givenName]; break;
        case 'description' : [propertyA, propertyB] = [a.sAMAccountName, b.sAMAccountName]; break;
        case 'descriptionComp': [propertyA, propertyB] = [a.userPrincipalName, b.userPrincipalName]; break;
        case 'inventoryNum' : [propertyA, propertyB] = [a.displayName, b.displayName]; break;
        case 'capitalizedOn' : [propertyA, propertyB] = [a.mail, b.mail]; break;
        // case 'costCenter': [propertyA, propertyB] = [a.memberOf, b.memberOf]; break;
        case 'capitalizedOn' : [propertyA, propertyB] = [a.lastLogon, b.lastLogon]; break;
        case 'capitalizedOn' : [propertyA, propertyB] = [a.whenCreated, b.whenCreated]; break;
        case 'capitalizedOn' : [propertyA, propertyB] = [a.whenChanged, b.whenChanged]; break;
        case 'capitalizedOn' : [propertyA, propertyB] = [a.userAccountControl, b.userAccountControl]; break;
      }

      // TODO: Melhorar logica, sempre jogar valores nulos e undefined por ultimo ao ordenar
      const valueA = isNaN(+propertyA)
        ? ( propertyA === undefined ? '' : propertyA ) // ^ caso queira maiores datas ordenadas após campos null/unde
        : ( propertyA === null ? '' : +propertyA );
      const valueB = isNaN(+propertyB)
        ? ( propertyB === undefined ? '' : propertyB )
        : ( propertyB === null ? '' : +propertyB );

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
