import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Inventory } from '../../models/inventory';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class InventoryService {
  private readonly API_URL = 'inventory';

  // Objeto com contratos, ouve mudanças em qualquer lugar da aplicação que o estiver usando.
  dataChange: BehaviorSubject<Inventory[]> = new BehaviorSubject<Inventory[]>([]);

  // Observable string sources on Components
  insertToTable$ = new Subject<any>();
  removeFromTable$ = new Subject<any>();

  constructor(private httpClient: HttpClient) {  }

  get data(): Inventory[] {
    return this.dataChange.value;
  }

  private insertToTable(asset: Inventory) {
    this.insertToTable$.next(asset);
  }

  private removeFromTable(asset: Inventory) {
    this.removeFromTable$.next(asset);
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
    this.httpClient.post(`api/${this.API_URL}/reprint`, asset).subscribe(data => { },
    (err: HttpErrorResponse) => {
      console.log(`Um erro ocorreu ao reimprimir Ativo, ${err.name} ${err.message}`);
   });
  }

  // ----------------
  // ADD, POST METHOD
  // ----------------
  insertAsset(asset: Inventory): void {
    this.httpClient.post(`api/${this.API_URL}`, asset).subscribe( (data: Inventory) => {
      this.insertToTable(data['asset']);
    },
    (err: HttpErrorResponse) => {
      console.log(`Um erro ocorreu ao adicionar Ativo, ${err.name} ${err.message}`);
   });
  }

  // DELETE METHOD
  deleteAtivo(_id: string): void {
    this.httpClient.delete(`api/${this.API_URL}/${_id}`).subscribe(data => {
      this.removeFromTable(data['asset']);
      },
      (err: HttpErrorResponse) => {
        console.log(`Um erro ocorreu ao apagar Ativo: ${_id}, ${err.name} ${err.message}`);
      }
    );
  }
}
