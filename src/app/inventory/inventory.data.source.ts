import { Inventory } from '../models/inventory';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { InventoryService } from './service/inventory.service';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';

export class InventoryDataSource extends DataSource<Inventory> {
  filterChange = new BehaviorSubject('');

  get filter(): string {
    return this.filterChange.value;
  }

  set filter(filter: string) {
    this.filterChange.next(filter);
  }

  filteredData: Inventory[] = [];
  renderedData: Inventory[] = [];

  constructor(public inventoryDatabase: InventoryService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Inventory[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.inventoryDatabase.dataChange,
      this.sort.sortChange,
      this.filterChange,
      this.paginator.page
    ];

    this.inventoryDatabase.getAllAssets();


    return merge(...displayDataChanges).pipe(map( () => {
        // Filter data
        this.filteredData = this.inventoryDatabase.data.slice().filter((asset: Inventory) => {
          // searchStr recebe campos do objeto contrato que serão usados para serem filtrados.
          const searchStr = ( asset._id +
                              asset.id +
                              asset.assetNum +
                              asset.subAssetNum +
                              asset.class +
                              asset.description +
                              asset.descriptionComp +
                              asset.inventoryNum +
                              asset.capitalizedOn +
                              asset.costCenter).toLowerCase();
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
  sortData(dataContrato: Inventory[]): Inventory[] {
    if (!this.sort.active || this.sort.direction === '') {
      return dataContrato;
    }

    return dataContrato.sort((a, b) => {
      let propertyA: number | Date | string = '';
      let propertyB: number | Date | string = '';
      // Campos que seram usados para ordenação;
      switch (this.sort.active) {
        case '_id': [propertyA, propertyB] = [a._id, b._id]; break;
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'assetNum': [propertyA, propertyB] = [a.assetNum, b.assetNum]; break;
        case 'subAssetNum' : [propertyA, propertyB] = [a.subAssetNum, b.subAssetNum]; break;
        case 'class' : [propertyA, propertyB] = [a.class, b.class]; break;
        case 'description' : [propertyA, propertyB] = [a.description, b.description]; break;
        case 'descriptionComp': [propertyA, propertyB] = [a.descriptionComp, b.descriptionComp]; break;
        case 'inventoryNum' : [propertyA, propertyB] = [a.inventoryNum, b.inventoryNum]; break;
        case 'capitalizedOn' : [propertyA, propertyB] = [a.capitalizedOn, b.capitalizedOn]; break;
        case 'costCenter': [propertyA, propertyB] = [a.costCenter, b.costCenter]; break;
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
