import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContratoService } from './services/contrato.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Contrato } from '../models/contrato';
import { DataSource} from '@angular/cdk/collections';
import { AddDialogComponent } from './components/add/add.dialog.component';
import { EditDialogComponent } from './components/edit/edit.dialog.component';
import { DeleteDialogComponent } from './components/delete/delete.dialog.component';
import { FileDialogComponent } from './components/file/file.dialog.component';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Documento } from '../models/documento';
import { Departamento } from '../models/departamento';

@Component({
  selector: 'app-contrato',
  templateUrl: 'contrato.componentl.html',
  styleUrls: ['contrato.componentl.html']
})

export class ContratoComponent implements OnInit {
  displayedColumns = [// '_id',
                      // 'idSecondary',
                      'objeto',
                      'estabFiscal',
                      'parceiro',
                      'cnpj',
                      'status',
                      'situacao',
                      // 'valTotal',
                      'deptoResponsavel',
                      'dataInicio',
                      'dataFim' ,
                      'btnActions'];
  contratoDatabase: ContratoService | null;
  contratoDataSource: ContratoDataSource | null;
  // index: number; // Posição da lista selecionada
  _id: string;

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public dataService: ContratoService) {}

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('filter',  {static: true}) filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  insertContrato() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: { contrato: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.contratoDatabase.dataChange.value.push(this.dataService.getDialogData());
        /* TODO: Necessário verificar meio de após inserir no banco, retornar para dataContrato,
           novo id do Banco para edição do novo contrato sem necessidade de dar refresh() */
        // this.refreshTable();
        this.refresh();
      }
    });
  }

  editContrato( i: number,
                _id: string,
                idSecondary: number,
                objeto: string,
                estabFiscal: string,
                parceiro: string,
                cnpj: number,
                status: string,
                situacao: string,
                deptoResponsavel: string,
                deptoPartList: Departamento,
                valTotal: number,
                valMensal: number,
                indReajuste: string,
                anaJuridico: boolean,
                diaAntecedencia: number,
                dataInicio: Date,
                dataFim: Date,
                obs: string,
                documentoList: Documento,
                natureza: string  ) {
    this._id = _id;
    // index row is used just for debugging proposes and can be removed
    // this.index = i;
    // console.log(this.index);
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { _id,
              idSecondary,
              objeto,
              estabFiscal,
              parceiro,
              cnpj,
              status,
              situacao,
              deptoResponsavel,
              deptoPartList,
              valTotal,
              valMensal,
              indReajuste,
              dataInicio,
              anaJuridico,
              diaAntecedencia,
              dataFim,
              obs,
              documentoList,
              natureza }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by _id
        const foundIndex = this.contratoDatabase.dataChange.value.findIndex(x => x._id === this._id);
        // Then you update that record using data from dialogData (values you enetered)
        this.contratoDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }

  deleteContrato( i: number,
                  _id: string,
                  objeto: string,
                  cnpj: number,
                  parceiro: string ) {
    // this.index = i;
    this._id = _id;
    const dialogRef = this.dialog.open(
      DeleteDialogComponent,
      { data: { _id,
                objeto,
                cnpj,
                parceiro }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.contratoDatabase.dataChange.value.findIndex(x => x._id === this._id);
        // for delete we use splice in order to remove single object from DataService
        this.contratoDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  showFile( i: number,
            _id: string,
            objeto: string,
            documentoList: Documento ) {
    this._id = _id;
    this.dialog.open(
      FileDialogComponent,
      { data: { _id,
                objeto,
                documentoList }
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  public loadData() {
    this.contratoDatabase = new ContratoService(this.httpClient);
    // Toda vez q é atualizado tambem atualiza mat-table em app.component.html atravez dos propertyBind
    this.contratoDataSource = new ContratoDataSource(this.contratoDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      // .debounceTime(150)
      // .distinctUntilChanged()
      .subscribe(() => {
        if (!this.contratoDataSource) {
          return;
        }
        this.contratoDataSource.filter = this.filter.nativeElement.value;
      });
  }
}

export class ContratoDataSource extends DataSource<Contrato> {
  filterChange = new BehaviorSubject('');

  get filter(): string {
    return this.filterChange.value;
  }

  set filter(filter: string) {
    this.filterChange.next(filter);
  }

  filteredData: Contrato[] = [];
  renderedData: Contrato[] = [];

  constructor(public contratoDatabase: ContratoService,
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
      this.contratoDatabase.dataChange,
      this.sort.sortChange,
      this.filterChange,
      this.paginator.page
    ];

    this.contratoDatabase.getTodosContratos();


    return merge(...displayDataChanges).pipe(map( () => {
        // Filter data
        this.filteredData = this.contratoDatabase.data.slice().filter((contrato: Contrato) => {
          // searchStr recebe campos do objeto contrato que serão usados para serem filtrados.
          const searchStr = ( contrato._id +
                              // contrato.idSecondary +
                              contrato.objeto +
                              contrato.estabFiscal +
                              contrato.parceiro +
                              contrato.cnpj +
                              contrato.status +
                              contrato.situacao +
                              contrato.deptoResponsavel +
                              contrato.dataInicio +
                              contrato.dataFim).toLowerCase();
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
      let propertyA: number | Date | string = '';
      let propertyB: number | Date | string = '';
      // Campos que seram usados para ordenação;
      switch (this.sort.active) {
        // case '_id': [propertyA, propertyB] = [a._id, b._id]; break;
        // case 'idSecondary': [propertyA, propertyB] = [a.idSecondary, b.idSecondary]; break;
        case 'objeto': [propertyA, propertyB] = [a.objeto, b.objeto]; break;
        case 'estabFiscal' : [propertyA, propertyB] = [a.estabFiscal, b.estabFiscal]; break;
        case 'parceiro' : [propertyA, propertyB] = [a.parceiro, b.parceiro]; break;
        case 'cnpj' : [propertyA, propertyB] = [a.cnpj, b.cnpj]; break;
        case 'status': [propertyA, propertyB] = [a.status, b.status]; break;
        case 'situacao' : [propertyA, propertyB] = [a.situacao, b.situacao]; break;
        // case 'valTotal' : [propertyA, propertyB] = [a.valTotal, b.valTotal]; break; // Não é necessário segundo usuário
        case 'deptoResponsavel' : [propertyA, propertyB] = [a.deptoResponsavel[0], b.deptoResponsavel[0]]; break;
        case 'dataInicio': [propertyA, propertyB] = [a.dataInicio, b.dataInicio]; break;
        case 'dataFim': [propertyA, propertyB] = [a.dataFim, b.dataFim]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
