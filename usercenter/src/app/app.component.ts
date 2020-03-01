import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from './services/data.service';
import {HttpClient} from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {Contrato} from './models/contrato';
import {DataSource} from '@angular/cdk/collections';
import {AddDialogComponent} from './dialogs/add/add.dialog.component';
import {EditDialogComponent} from './dialogs/edit/edit.dialog.component';
import {DeleteDialogComponent} from './dialogs/delete/delete.dialog.component';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  displayedColumns = ['_id',
                      'objeto',
                      'estabFiscal',
                      'parceiro',
                      'cnpj',
                      'status',
                      'situacao',
                      'deptoPartList',
                      'valTotal',
                      'dataInicio',
                      'dataFim' ,
                      'actions'];
  exampleDatabase: DataService | null;
  dataSource: ExampleDataSource | null;
  index: number; // Posição da lista selecionada
  _id: string;

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public dataService: DataService) {}

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('filter',  {static: true}) filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: { contrato: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number,
            _id: string,
            objeto: string,
            estabFiscal: string,
            parceiro: string,
            cnpj: number,
            status: string,
            situacao: string,
            deptoPartList: string,
            valTotal: string,
            dataInicio: string,
            dataFim: string) {
    this._id = _id;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    console.log(this.index);
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {_id,
             objeto,
             estabFiscal,
             parceiro,
             cnpj,
             status,
             situacao,
             deptoPartList,
             valTotal,
             dataInicio,
             dataFim}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by _id
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x._id === this._id);
        // Then you update that record using data from dialogData (values you enetered)
        this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, _id: string, objeto: string, estabFiscal: string, parceiro: string) {
    this.index = i;
    this._id = _id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {_id: _id,
             objeto,
             estabFiscal,
             parceiro}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x._id === this._id);
        // for delete we use splice in order to remove single object from DataService
        this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }


  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  public loadData() {
    this.exampleDatabase = new DataService(this.httpClient);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      // .debounceTime(150)
      // .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }
}

export class ExampleDataSource extends DataSource<Contrato> {
  filterChange = new BehaviorSubject('');

  get filter(): string {
    return this.filterChange.value;
  }

  set filter(filter: string) {
    this.filterChange.next(filter);
  }

  filteredData: Contrato[] = [];
  renderedData: Contrato[] = [];

  constructor(public exampleDatabase: DataService,
              public paginator: MatPaginator,
              public sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Contrato[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.sort.sortChange,
      this.filterChange,
      this.paginator.page
    ];

    this.exampleDatabase.getTodosContratos();


    return merge(...displayDataChanges).pipe(map( () => {
        // Filter data
        this.filteredData = this.exampleDatabase.data.slice().filter((contrato: Contrato) => {
          const searchStr = (contrato._id + contrato.objeto + contrato.documentoList + contrato.dataInicio).toLowerCase();
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
  sortData(dataContrato: Contrato[]): Contrato[] {
    if (!this.sort.active || this.sort.direction === '') {
      return dataContrato;
    }

    return dataContrato.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this.sort.active) {
        case '_id': [propertyA, propertyB] = [a._id, b._id]; break;
        case 'objeto': [propertyA, propertyB] = [a.objeto, b.objeto]; break;
        case 'estabFiscal' : [propertyA, propertyB] = [a.estabFiscal, b.estabFiscal]; break;
        case 'parceiro' : [propertyA, propertyB] = [a.parceiro, b.parceiro]; break;
        case 'cnpj' : [propertyA, propertyB] = [a.cnpj, b.cnpj]; break;
        case 'status': [propertyA, propertyB] = [a.status, b.status]; break;
        case 'situacao' : [propertyA, propertyB] = [a.situacao, b.situacao]; break;
        case 'deptoPartList' : [propertyA, propertyB] =
          [a.deptoPartList[0].departamento, b.deptoPartList[0].departamento]; break; // Pegar todos os Deptos!!!
        // Colocar quantidade de documentos aqui
        case 'valTotal' : [propertyA, propertyB] = [a.valTotal, b.valTotal]; break;
        case 'dataInicio': [propertyA, propertyB] = [a.dataInicio, b.dataInicio]; break;
        case 'dataFim': [propertyA, propertyB] = [a.dataFim, b.dataFim]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
