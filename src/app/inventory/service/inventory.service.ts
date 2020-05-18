import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Inventory } from '../../models/inventory';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'ngx-alerts';
// import { AppConfig } from '../../config/app.config.js';

@Injectable()
export class InventoryService {
  private readonly API_URL = 'inventory';

  // Objeto com contratos, ouve mudanças em qualquer lugar da aplicação que o estiver usando.
  dataChange: BehaviorSubject<Inventory[]> = new BehaviorSubject<Inventory[]>([]);

  // Temporarily stores data from dialogs
  dialogData: Inventory;

  constructor(private httpClient: HttpClient,
              private alert: AlertService) {  }


  get data(): Inventory[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllAssets(): void {
    this.httpClient.get<Inventory[]>(`api/${this.API_URL}`).subscribe(assets => {
      this.dataChange.next(assets);
    },
    (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
    });
  }

  rePrint(asset: Inventory): void {
    this.httpClient.post(`api/${this.API_URL}/reprint`, asset).subscribe(data => {
      this.alert.info(data['logPrinter'][data['logPrinter'].length - 1].message);
    },
    (err: HttpErrorResponse) => {
      console.log(`Um erro ocorreu ao reimprimir Ativo, ${err.name} ${err.message}`);
   });
  }

  // ----------------
  // ADD, POST METHOD
  // ----------------
  // TODO: Tratar mensagens de erro e conclusão em TOAST
  insertAsset(asset: Inventory): void {
    this.dialogData = asset;

    this.httpClient.post(`api/${this.API_URL}`, asset).subscribe(data => {
      // this.dialogData = asset;
      console.log('Ativo adicionado com sucesso');
      console.log(data);
      this.alert.info(data['logPrinter'][data['logPrinter'].length - 1].message);
    },
    (err: HttpErrorResponse) => {
      console.log(`Um erro ocorreu ao adicionar Ativo, ${err.name} ${err.message}`);
      // this.alert.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
   });
  }

   // UPDATE, patch METHOD
  //  updateContrato(asset: Inventory): void {
  //   /* TODO: Verificar modo de atualizar tabela de contratos após algum retorno do endPoint
  //       asset tabela estava sendo atualizada antes do retorno do endPoint, causando erros.
  //   */
  //   this.dialogData = asset;

  //   this.httpClient.patch(`api/${this.API_URL}/${asset._id}`, asset).subscribe(data => {
  //       // this.dialogData = asset;
  //       console.log('Inventory atualizado com sucesso');
  //       // this.toasterService.showToaster('Successfully edited', 3000);
  //     },
  //     (err: HttpErrorResponse) => {
  //       console.log(`Um erro ocorreu ao atualizar asset: ${asset._id}, ${err.name} ${err.message}`);
  //       // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
  //     }
  //   );
  // }

  // DELETE METHOD
  // deleteContrato(_id: string): void {
  //   this.httpClient.delete(`api/${this.API_URL}/${_id}`).subscribe(data => {
  //     console.log(`Inventory apagado ${data['']}`);
  //     // this.toasterService.showToaster('Successfully deleted', 3000);
  //     },
  //     (err: HttpErrorResponse) => {
  //       // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
  //       console.log(`Um erro ocorreu ao apagar asset: ${_id}, ${err.name} ${err.message}`);
  //     }
  //   );
  // }
}
