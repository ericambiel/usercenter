import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contrato } from '../models/contrato';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

// import { ResponseContentType } from '@angular/common/http';

@Injectable()
export class DataService {
  private readonly API_URL = 'http://localhost:3000/contratos'; // 'https://api.github.com/repos/angular/angular';

  dataChange: BehaviorSubject<Contrato[]> = new BehaviorSubject<Contrato[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor(private httpClient: HttpClient) {}

  get data(): Contrato[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */

  // getFileContrato(nome: string): void {
  //   this.httpClient.get<Contrato[]>('http://localhost:3000/file/contrato/' + nome).subscribe(data => {
  //       console.log(data['']);
  //     },
  //   (error: HttpErrorResponse) => {
  //     console.log (error.name + ' ' + error.message);
  //   });
  // }

  getFileContrato(nome: string): Observable<Blob> {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const options = {  responseType: 'blob' as 'json' };

    return this.httpClient.get<Blob>(
      'http://localhost:3000/file/contrato/' + nome,
      options
    );
  }

  getTodosContratos(): void {
    this.httpClient.get<Contrato[]>(this.API_URL).subscribe(data => {
      this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
    });
  }

  // // DEMO ONLY, you can find working methods below
  // addContrato(contrato: Contrato): void {
  //   this.dialogData = contrato;
  // }

  // ADD, POST METHOD
  addContrato(contrato: Contrato): void {
    this.httpClient.post(this.API_URL, contrato).subscribe(data => {
      this.dialogData = contrato;
      console.log('Contrato adicionado com sucesso');
      // this.toasterService.showToaster('Successfully added', 3000);
    },
    (err: HttpErrorResponse) => {
      console.log('Um erro ocorreu: ' + err.name + ' ' + err.message);
      // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
   });
  }

  updateContrato(contrato: Contrato): void {
    this.dialogData = contrato;
  }

  deleteContrato(_id: string): void {
    console.log(_id);
  }
}



/* REAL LIFE CRUD Methods I've used in projects. ToasterService uses Material Toasts for displaying messages:

    // ADD, POST METHOD
    addItem(kanbanItem: KanbanItem): void {
    this.httpClient.post(this.API_URL, kanbanItem).subscribe(data => {
      this.dialogData = kanbanItem;
      this.toasterService.showToaster('Successfully added', 3000);
      },
      (err: HttpErrorResponse) => {
      this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
    });
   }

    // UPDATE, PUT METHOD
     updateItem(kanbanItem: KanbanItem): void {
    this.httpClient.put(this.API_URL + kanbanItem._id, kanbanItem).subscribe(data => {
        this.dialogData = kanbanItem;
        this.toasterService.showToaster('Successfully edited', 3000);
      },
      (err: HttpErrorResponse) => {
        this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }

  // DELETE METHOD
  deleteItem(_id: string): void {
    this.httpClient.delete(this.API_URL + _id).subscribe(data => {
      console.log(data['']);
        this.toasterService.showToaster('Successfully deleted', 3000);
      },
      (err: HttpErrorResponse) => {
        this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }
*/




