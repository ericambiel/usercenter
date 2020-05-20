import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Inventory } from '../../models/inventory';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'ngx-alerts';
// import { AppConfig } from '../../config/app.config.js';

@Injectable()
export class InventoryService {
  private readonly API_URL = 'inventory';

  // Objeto com contratos, ouve mudanças em qualquer lugar da aplicação que o estiver usando.
  dataChange: BehaviorSubject<Inventory[]> = new BehaviorSubject<Inventory[]>([]);
  // Observable string sources
  private componentMethodCallSource = new Subject<any>();

  // Observable string streams
  updateTable$ = this.componentMethodCallSource.asObservable();

  // Temporarily stores data from dialogs
  // dialogData: Inventory;

  constructor(private httpClient: HttpClient,
              private alert: AlertService) {  }


  get data(): Inventory[] {
    return this.dataChange.value;
  }

  updateTable(data: Inventory) {
    // Para adicionar um Ativo a tabela insira uma nova linha ao dataChange
    this.dataChange.value.push(data);
    this.componentMethodCallSource.next();
  }

  // getDialogData() {
  //   return this.dialogData;
  // }

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
  async insertAsset(asset: Inventory): Promise<void> {
    await this.httpClient.post(`api/${this.API_URL}`, asset).subscribe( (data: Inventory) => {
      this.updateTable(data);

      console.log('Ativo adicionado com sucesso');
      this.alert.info(data['logPrinter'][data['logPrinter'].length - 1].message);
    },
    (err: HttpErrorResponse) => {
      console.log(`Um erro ocorreu ao adicionar Ativo, ${err.name} ${err.message}`);
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
  async deleteAtivo(_id: string): Promise<void> {
    await this.httpClient.delete(`api/${this.API_URL}/${_id}`).subscribe(data => {
      // Se foi apagado do banco então apagar da tabela
      // for delete we use splice in order to remove single object from DataService
      const foundIndex = this.dataChange.value.findIndex(x => x._id === _id);
      this.dataChange.value.splice(foundIndex, 1);

      this.alert.info(data['message']);
      },
      (err: HttpErrorResponse) => {
        console.log(`Um erro ocorreu ao apagar Ativo: ${_id}, ${err.name} ${err.message}`);
      }
    );
  }
}
