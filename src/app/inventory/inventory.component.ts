import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { InventoryService } from './service/inventory.service';
import { InventoryDataSource } from './inventory.data.source';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent } from 'rxjs';
import { Inventory } from '../models/inventory';
import { DeleteDialogComponent } from './components/delete/delete.dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-inventory',
  templateUrl: 'inventory.component.html',
  styleUrls: ['inventory.component.scss']
})

export class InventoryComponent implements OnInit {
  inventoryDatabase: InventoryService | null;
  inventoryDataSource: InventoryDataSource | null; // Dados em memória da Tabela

  dataAsset: Inventory; // Objeto que fara bind com a View e que possuirá valores digitados.

  _id: string; // Caso remova um ativo, usar para atualizar a tabela.

  // TODO: Criar Classe util para validação de formes
  /** Descritor dos tipos de validação */
  formControl = new FormControl('', [
    // Validators.email,
    Validators.required
  ]);

  // Colunas que serão exibidas na tabela
  displayedColumns = [ 'id', 'description', 'descriptionComp', 'assetNum', 'subAssetNum',
  'class', 'inventoryNum', 'costCenter', 'capitalizedOn', 'btnActions' ];

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public inventoryService: InventoryService) {

    /** Insere Ativo na tabela após receber resposta positiva do endPoint - Observable */
    this.inventoryService.insertToTable$.subscribe((asset) => {
      // Para adicionar um Ativo a tabela insira uma nova linha ao DataService
      this.inventoryDatabase.dataChange.value.push(asset);

      this.refreshTable();
      this.newAsset(new Inventory());
    });

    /** Remove Ativo na tabela após receber resposta positiva do endPoint - Observable */
    this.inventoryService.removeFromTable$.subscribe((asset) => {
      // for delete we use splice in order to remove single object from DataService
      const foundIndex = this.inventoryDatabase.dataChange.value.findIndex(x => x._id === this._id);
      this.inventoryDatabase.dataChange.value.splice(foundIndex, 1);

      this.refreshTable();
    });
  }

  // ViewChildren que acessão propriedades no HTML da tabela na aplicação
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('filter',  {static: true}) filter: ElementRef;

  /** Carrega dados na inicialização desse componente */
  ngOnInit(): void {
    this.loadData();
    this.newAsset(new Inventory());
  }

  newAsset(asset: Inventory) {
    this.dataAsset = asset;
  }

  // TODO: Criar Classe util para validação de forms
  /**
   * Validação de campos obrigatórios na FORM
   */
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Campo obrigatório'
      : '';
  }

  submit() {
    console.log('submit');
  }

  onDownloadReport() {
    // TODO: Criar relatório.
  }

  // i to debug
  onReprint(i, asset) {
    this.inventoryService.rePrint(asset); // Imprimir.
  }

  onPrint() {
    this.insertAssetToBD();
  }

  /** Insere contrato ao BD via endPoint */
  insertAssetToBD(): void {
    this.inventoryService.insertAsset(this.dataAsset);
  }

  editAsset(i, asset: Inventory) { }

  deleteAsset(i, asset: Inventory) {
    this._id = asset._id;
    const dialogRef = this.dialog.open(
      DeleteDialogComponent,
      { data: { asset }
    });
  }

  /**
   * Carrega objeto com Ativos
   */
  loadData() {
    // this.dataAsset = new Inventory(); // TODO: Verificar se isso aqui esta certo aqui.
    this.inventoryDatabase = new InventoryService(this.httpClient);
    // Toda vez q é atualizado tambem atualiza mat-table em app.component.html através dos propertyBind
    this.inventoryDataSource = new InventoryDataSource(this.inventoryDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      // .debounceTime(150)
      // .distinctUntilChanged()
      .subscribe(() => {
        if (!this.inventoryDataSource) {
          return;
        }
        this.inventoryDataSource.filter = this.filter.nativeElement.value;
      });
  }

  /**
   * Atualiza itens da tabela tabela.
   */
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}
