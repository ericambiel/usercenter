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

import * as XLSX from 'xlsx';
import { sheet } from '../libs/Sheet';

@Component({
  selector: 'app-contrato',
  templateUrl: 'contrato.componentl.html',
  styleUrls: ['contrato.component.scss']
})

export class ContratoComponent implements OnInit {
  displayedColumns = [// '_id',
                      'id',
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
  contratoDatabase: ContratoService | null; // Dados temporários
  contratoDataSource: ContratoDataSource | null;
  // index: number; // Posição da lista selecionada
  _id: string;

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public contratoService: ContratoService) {}

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('filter',  {static: true}) filter: ElementRef;

  ngOnInit() {
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
        this.contratoDatabase.dataChange.value.push(this.contratoService.getDialogData());
        /* TODO: Necessário verificar meio de após inserir no banco, retornar para dataContrato,
           novo id do Banco para edição do novo contrato sem necessidade de dar refresh() */
        this.loadData();
        // this.refreshTable();
      }
    });
  }

  editContrato( i: number,
                _id: string,
                id: string,
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
              id,
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
        this.contratoDatabase.dataChange.value[foundIndex] = this.contratoService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }

  /** Atualiza sempre a tabela sempre q um end point for requisitado. */
  // public refreshAfterEndPointAction() {
  //   const foundIndex = this.contratoDatabase.dataChange.value.findIndex(x => x._id === this._id);
  //   // Then you update that record using data from dialogData (values you enetered)
  //   this.contratoDatabase.dataChange.value[foundIndex] = this.contratoService.getDialogData();
  //   // And lastly refresh table
  //   this.refreshTable();
  // }

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

  /**
   * Atualiza somente tabela.
   */
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

  onDownloadReport() {
    // Clona objeto desassociando do BehaviorSubjects
    let copyContracts = this.cloneBehaviorSubjectsObj(this.contratoDataSource.contratoDatabase.data);
    // Normaliza dados para criação da planilha
    copyContracts = this.normalizeContratoReporte(copyContracts);
    // Cria planilha e retorna buffer
    const wbout: ArrayBuffer = this.createReportSheet(copyContracts);
    // Devolve para navegador
    const file = new Blob([wbout], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    this.contratoService.handleFileDownload(file, 'Relatório Contrato');
  }

  // TODO: desacoplar para class Sheet
  private createReportSheet(copyContracts: any) {
    const header = [
      ['ID', 'Natureza', 'Objeto', 'Estab. Fiscal', 'Parceiro', 'CNPJ / CPF', 'Status', 'Situação',
        'Depto. Responsável', 'Valor Total', 'Valor Mensal', 'Data Início', 'Data Fim',
        'Deptos participantes', 'Índice de Reajuste', 'Analise Jurídico', 'Dias de antecedência',
        'Nº Docs', 'OBS', 'Histórico'],
    ];

    const workBook = XLSX.utils.book_new();
    let workSheet = XLSX.utils.aoa_to_sheet(header);

    XLSX.utils.sheet_add_json(workSheet, copyContracts, {
      header: ['id', 'natureza', 'objeto', 'estabFiscal', 'parceiro', 'cnpj', 'status', 'situacao',
        'deptoResponsavel', 'valTotal', 'valMensal', 'dataInicio', 'dataFim', 'deptosParticipantes',
        'indReajuste', 'anaJuridico', 'diaAntecedencia', 'qtdDocumentos', 'obs', 'historico'],
      skipHeader: true,
      origin: 'A2'
    });

    workSheet = sheet.toMaskXLSX(workSheet, ['J', 'K'], '_-R$ * #,##0.00_-;-R$ * #,##0.00_-;_-R$ * "-"??_-;_-@_-');
    workSheet = sheet.toMaskXLSX(workSheet, ['F'], '[<=9999]0000;[>=999999999999]00\\.000\\.000\\/0000-00;000\\.000\\.000-00');

    XLSX.utils.book_append_sheet(workBook, workSheet, 'Contratos');

    return XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
  }

  // TODO: Criar classe util para esta função.
  /**
   * Clona objeto BehaviorSubjects
   * @param obj Objeto a ser clonado
   */
  cloneBehaviorSubjectsObj(obj) {
    return Array.isArray(obj)
    ? obj.map(item => this.cloneBehaviorSubjectsObj(item))
    : obj instanceof Date
    ? new Date(obj.getTime())
    : obj && typeof obj === 'object'
    ? Object.getOwnPropertyNames(obj).reduce((o, prop) => {
        o[prop] = this.cloneBehaviorSubjectsObj(obj[prop]);
        return o;
      }, {})
    : obj;
  }
  // TODO: Criar classe util para esta função.
  private normalizeContratoReporte(contratos: Array<any>): Array<any> {
    contratos.forEach(contrato => {
      contrato.dataInicio = contrato.dataInicio !== undefined ? this.hotFixConvertDateXLSX(contrato.dataInicio) : 'Ñ Atribuído';
      contrato.dataFim = contrato.dataFim !== undefined ? this.hotFixConvertDateXLSX(contrato.dataFim) : 'Indeterminado';
      contrato.anaJuridico = contrato.anaJuridico === true ? 'Sim' : 'Não';
      contrato.documentoList.forEach((documento) => {
        contrato.qtdDocumentos = contrato.qtdDocumentos === undefined
          ? contrato.qtdDocumentos = 1
          : ++contrato.qtdDocumentos;
      });
      contrato.deptoPartList.forEach(depart => {
        contrato.deptosParticipantes = contrato.deptosParticipantes === undefined
          ? contrato.deptosParticipantes = `| ${depart.departamento} |`
          : contrato.deptosParticipantes += `| ${depart.departamento} |`;
      });
      delete contrato.documentoList;
      delete contrato.deptoPartList;
      delete contrato._id;
      delete contrato.idSecondary;
      delete contrato.options;
      delete contrato.logEmail;
      delete contrato.__v;
      delete contrato.createdAt;
      delete contrato.updatedAt;
    });
    return contratos;
  }
  // TODO: Criar classe util para esta função.
  private hotFixConvertDateXLSX(date: string|Date): Date {
    if (typeof date === 'string') { date = new Date (date); }
    return new Date(date.setSeconds(date.getSeconds() + 28));
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
                              contrato.id +
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
        case '_id': [propertyA, propertyB] = [a._id, b._id]; break;
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        // case 'idSecondary': [propertyA, propertyB] = [a.idSecondary, b.idSecondary]; break;
        case 'objeto': [propertyA, propertyB] = [a.objeto, b.objeto]; break;
        case 'estabFiscal' : [propertyA, propertyB] = [a.estabFiscal, b.estabFiscal]; break;
        case 'parceiro' : [propertyA, propertyB] = [a.parceiro, b.parceiro]; break;
        case 'cnpj' : [propertyA, propertyB] = [a.cnpj, b.cnpj]; break;
        case 'status': [propertyA, propertyB] = [a.status, b.status]; break;
        case 'situacao' : [propertyA, propertyB] = [a.situacao, b.situacao]; break;
        // case 'valTotal' : [propertyA, propertyB] = [a.valTotal, b.valTotal]; break; // Não é necessário segundo usuário
        case 'deptoResponsavel' : [propertyA, propertyB] = [a.deptoResponsavel, b.deptoResponsavel]; break;
        case 'dataInicio': [propertyA, propertyB] = [a.dataInicio, b.dataInicio]; break;
        case 'dataFim': [propertyA, propertyB] = [a.dataFim, b.dataFim]; break;
      }

      // TODO: Melhorar logica, sempre jogar valores nulos e undefined por ultimo ao ordenar
      const valueA = isNaN(+propertyA)
        ? ( propertyA === undefined ? '' : propertyA ) // ^ caso queira datas maiores ordenadas após null/unde
        : ( propertyA === null ? '' : +propertyA );
      const valueB = isNaN(+propertyB)
        ? ( propertyB === undefined ? '' : propertyB )
        : ( propertyB === null ? '' : +propertyB );

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
