import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { InventoryService } from './service/inventory.service';
import { InventoryDataSource } from './inventory.data.source';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent } from 'rxjs';
import { Inventory } from '../models/inventory';
import { AlertService } from 'ngx-alerts';
import { DeleteDialogComponent } from './components/delete/delete.dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { async } from '@angular/core/testing';
import { InventoryService } from '../../../.history/src/app/inventory/service/inventory.service_20200520085747';

@Component({
  selector: 'app-inventory',
  templateUrl: 'inventory.component.html',
  styleUrls: ['inventory.component.scss']
})

export class InventoryComponent implements OnInit {
  inventoryDatabase: InventoryService | null; // Dados temporários
  inventoryDataSource: InventoryDataSource | null;

  dataAsset: Inventory; // Objeto que fara bind com a View e que possuirá valores digitados.

  _id: string; // Caso remova ou altere um componente, usar para atualizar a tabela.

  // TODO: Criar Classe util para validação de formes
  /** Descritor dos tipos de validação */
  formControl = new FormControl('', [
    // Validators.email,
    Validators.required
  ]);

  // Colunas que serão exibidas na tabela
  displayedColumns = [ 'id', 'description', 'descriptionComp', 'assetNum', 'subAssetNum',
  'class', 'inventoryNum', 'costCenter', 'capitalizedOn', 'btnActions' ];

  // dpCapitalizedOn: Date;

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public inventoryService: InventoryService) {
    /** Insere Ativo na tabela após receber resposta positiva do endPoint - Observable */
    this.inventoryService.updateTable$.subscribe(() => {
      // this.inventoryDatabase.dataChange.value.push(this.inventoryService.getDialogData());
      this.refreshTable();
    });
  }

  // ViewChildren que acessão propriedades da tabela na aplicação
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('filter',  {static: true}) filter: ElementRef;

  /** Carrega dados na inicialização desse componente */
  ngOnInit(): void {
    this.loadData();
  }

  // TODO: Criar Classe util para validação de formes
  /**
   * Validação de campos obrigatórios na FORM
   */
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Campo obrigatório'
      : this.formControl.hasError('email')
        ? 'Não é um e-mail valido'
        : '';
  }

  submit() {
    console.log('submit');
  }

  async onPrint() {
    await this.insertAssetToBD();
    // this.updateTable();
  }

  /** Insere contrato ao BD via endPoint */
  async insertAssetToBD(): Promise<void> {
    await this.inventoryService.insertAsset(this.dataAsset);
  }

  editAsset(i, asset: Inventory) { }

  deleteAsset(i, asset: Inventory) {
    this._id = asset._id;
    const dialogRef = this.dialog.open(
      DeleteDialogComponent,
      { data: { asset, inventoryDatabase: this.inventoryDatabase } } );

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) { // 1 Se clicou em apagou.
        // // Já esta sendo feito pelo endpoint em serviço.
        // const foundIndex = this.inventoryDatabase.dataChange.value.findIndex(x => x._id === this._id);
        // // for delete we use splice in order to remove single object from DataService
        // this.inventoryDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  // i to debug
  onReprint(i, asset) {
    this.inventoryService.rePrint(asset); // Imprimir.
  }

  /**
   * Carrega objeto com Ativos
   */
  loadData() {
    this.dataAsset = new Inventory(); // TODO: Verificar se isso aqui esta certo aqui.
    // this.inventoryDatabase = new InventoryService(this.httpClient, new AlertService({})); // Não mostra Alerts
    this.inventoryDatabase = this.inventoryService; // Agora service e database são a mesma instancia.
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
   * Atualiza somente tabela.
   */
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}
