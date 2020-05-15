import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { InventoryService } from './service/inventory.service';
import { InventoryDataSource } from './inventory.data.source';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent } from 'rxjs';
import { Inventory } from '../../../.history/src/app/models/inventory_20200515161904';


@Component({
  selector: 'app-inventory',
  templateUrl: 'inventory.component.html',
  styleUrls: ['inventory.component.scss']
})

export class InventoryComponent implements OnInit {
  inventoryDatabase: InventoryService | null; // Dados temporários
  InventoryDataSource: InventoryDataSource | null;

  dataAsset: Inventory; // Objeto que fara bind com a View e que possuirá valores digitados.

  // TODO: Criar Classe util para validação de formes
  /** Descritor dos tipos de validação */
  formControl = new FormControl('', [
    // Validators.email,
    Validators.required
  ]);

  dpCapitalizedOn: Date;

  constructor(public httpClient: HttpClient,
              // public dialog: MatDialog,
              public inventoryService: InventoryService) {  }

  // ViewChildren que acessão propriedades da tabela na aplicação
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('filter',  {static: true}) filter: ElementRef;

  /** Carrega dados na inicialização desse componente */
  ngOnInit(): void {
    this.loadData();
  }

  /** Recarrega dados */
  refresh() {
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

  onPrint() {
    console.log('imprimir');
    this.insertAssetToTable();

  }

  /** Insere contrato ao BD via endPoint */
  insertAssetToBD(): void {
    this.inventoryService.insertAsset(this.dataAsset);
  }

  /** Insere Ativo no sistema via EndPoint no service */
  insertAssetToTable() {
    // Para adicionar um Ativo a tabela insira uma nova linha ao DataService
    // getDialogData() possui dados temporários da Form preenchida
    this.inventoryDatabase.dataChange.value.push(this.inventoryService.getDialogData());
    /* TODO: Necessário verificar meio de após inserir no banco, retornar para dataContrato,
           novo id do Banco para edição do novo contrato sem necessidade de dar refresh() */
    this.refresh();
    // this.refreshTable();
  }

  /**
   * Carrega objeto com Ativos
   */
  loadData() {
    this.inventoryDatabase = new InventoryService(this.httpClient);
    // Toda vez q é atualizado tambem atualiza mat-table em app.component.html através dos propertyBind
    this.InventoryDataSource = new InventoryDataSource(this.inventoryDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      // .debounceTime(150)
      // .distinctUntilChanged()
      .subscribe(() => {
        if (!this.InventoryDataSource) {
          return;
        }
        this.InventoryDataSource.filter = this.filter.nativeElement.value;
      });
  }

}
