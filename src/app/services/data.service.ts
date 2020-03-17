import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contrato } from '../models/contrato';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../../config/app.config';

// import { ResponseContentType } from '@angular/common/http';

@Injectable()
export class DataService {
  private readonly API_URL = '/contratos'; // 'https://api.github.com/repos/angular/angular';

  private appConfig = new AppConfig();

  dataChange: BehaviorSubject<Contrato[]> = new BehaviorSubject<Contrato[]>([]);
  // Temporarily stores data from dialogs
  dialogData: Contrato;

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

  // Criar nova classe de serviço para colocar esse metodo
  getFileContrato(nome: string): Observable<Blob> {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const options = { responseType: 'blob' as 'json',
                      reportProgress: true }; // Informa o tamanho do arquivo ao navegar

    return this.httpClient.get<Blob>(
      this.appConfig.getRestBaseUrl() + '/file/contrato/' + nome,
      options
    );
  }

  // * Nomeia e baixa arquivo no navegado * /
  handleFileDownload(res: any, fileName: string) {
    const file = new Blob([res], {
      type: res.type
    });

    // Browser - IE
    if (navigator && navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(file);
      return;
    }

    // Browser - Chrome/Firefox
    const blob = URL.createObjectURL(file);

    const link = document.createElement('a');
    link.href = blob; // Endereço do arquivo
    link.download = fileName; // Adiciona nome/extensão ao arquivo

    link.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })); // Baixa arquivo.

    // window.open(link.href, '_blank'); // Abrir em uma nova janela e exibir.

    setTimeout(() => {
      URL.revokeObjectURL(blob); // Revoga link blob gerado
      link.remove(); // Revoga link virtual gerado
    }, 100); // Sleep p/ firefox
  }

  getTodosContratos(): void {
    this.httpClient.get<Contrato[]>(`${this.appConfig.getRestBaseUrl()}${this.API_URL}`).subscribe(data => {
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

  // updateContrato(contrato: Contrato): void {
  //   this.dialogData = contrato;
  // }

  deleteContrato(_id: string): void {
    console.log(_id);
  }

  // ----------------
  // ADD, POST METHOD
  // ----------------
  addContrato(contrato: Contrato): void {
    this.httpClient.post(`${this.appConfig.getRestBaseUrl()}${this.API_URL}`, contrato).subscribe(data => {
      this.dialogData = contrato;
      console.log('Contrato adicionado com sucesso');
      // this.toasterService.showToaster('Successfully added', 3000);
    },
    (err: HttpErrorResponse) => {
      console.log('Um erro ocorreu: ' + err.name + ' ' + err.message);
      // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
   });
  }

   // UPDATE, patch METHOD
   updateContrato(contrato: Contrato): void {
    this.httpClient.patch(`${this.appConfig.getRestBaseUrl()}${this.API_URL}/${contrato._id}`, contrato).subscribe(data => {
        this.dialogData = contrato;
        console.log('Contrato adicionado com sucesso');
        // this.toasterService.showToaster('Successfully edited', 3000);
      },
      (err: HttpErrorResponse) => {
        console.log('Um erro ocorreu: ' + err.name + ' ' + err.message);
        // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }
}



/* REAL LIFE CRUD Methods I've used in projects. ToasterService uses Material Toasts for displaying messages:

    // ADD, POST METHOD
    addItem(kanbanItem: KanbanItem): void {
    this.httpClient.post(this.appConfig.getRestBaseUrl(), kanbanItem).subscribe(data => {
      this.dialogData = kanbanItem;
      this.toasterService.showToaster('Successfully added', 3000);
      },
      (err: HttpErrorResponse) => {
      this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
    });
   }

    // UPDATE, PUT METHOD
     updateItem(kanbanItem: KanbanItem): void {
    this.httpClient.put(this.appConfig.getRestBaseUrl() + kanbanItem._id, kanbanItem).subscribe(data => {
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
    this.httpClient.delete(this.appConfig.getRestBaseUrl() + _id).subscribe(data => {
      console.log(data['']);
        this.toasterService.showToaster('Successfully deleted', 3000);
      },
      (err: HttpErrorResponse) => {
        this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }
*/




