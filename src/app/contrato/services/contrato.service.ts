import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contrato } from '../../models/contrato';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { AppConfig } from '../../config/app.config.js';

// import { ResponseContentType } from '@angular/common/http';

@Injectable()
export class ContratoService {
  private readonly API_URL = 'contratos';

  // private appConfig = new AppConfig();

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

  /* ///////////////////////////////////////////////////////////////
    INÍCIO - Refatorar e passar para file.service.ts
  /////////////////////////////////////////////////////////////// */

  // getFileContrato(nome: string): void {
  //   this.httpClient.get<Contrato[]>('http://localhost:3000/file/contrato/' + nome).subscribe(data => {
  //       console.log(data['']);
  //     },
  //   (error: HttpErrorResponse) => {
  //     console.log (error.name + ' ' + error.message);
  //   });
  // }

  // Baixa arquivo do REST
  getFileContrato(nome: string): Observable<Blob> {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const options = { responseType: 'blob' as 'json',
                      reportProgress: true }; // Informa o tamanho do arquivo ao navegar

    return this.httpClient.get<Blob>(
       'api/file/contrato/' + nome, // this.appConfig.getRestBaseUrl() +
      options
    );
  }

  // * Nomeia e entrega arquivo para navegador * /
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
    // Após usar link, revoga-o.
    setTimeout(() => {
      URL.revokeObjectURL(blob); // Revoga link blob gerado
      link.remove(); // Revoga link virtual gerado
    }, 100); // Sleep p/ firefox
  }

  /* ///////////////////////////////////////////////////////////////
    FIM - Refatorar e passar para file.service.ts
  /////////////////////////////////////////////////////////////// */

  getTodosContratos(): void {
    this.httpClient.get<Contrato[]>(`api/${this.API_URL}`).subscribe(data => {
      this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
    });
  }

  // // Métodos demonstrativos, não exigem endPoint.
  // addContrato(contrato: Contrato): void {
  //   this.dialogData = contrato;
  // }

  // updateContrato(contrato: Contrato): void {
  //   this.dialogData = contrato;
  // }

  // deleteContrato(_id: string): void {
  //   console.log(`Contra: ${_id} apagado!!!`);
  // }

  // ----------------
  // ADD, POST METHOD
  // ----------------
  // TODO: Tratar mensagens de erro e conclusão em TOAST
  insertContrato(contrato: Contrato): void {
    this.dialogData = contrato;

    this.httpClient.post(`api/${this.API_URL}`, contrato).subscribe(data => {
      // this.dialogData = contrato;
      console.log('Contrato adicionado com sucesso');
      // this.toasterService.showToaster('Successfully added', 3000);
    },
    (err: HttpErrorResponse) => {
      console.log(`Um erro ocorreu ao adicionar contrato, ${err.name} ${err.message}`);
      // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
   });
  }

   // UPDATE, patch METHOD
   updateContrato(contrato: Contrato): void {
    /* TODO: Verificar modo de atualizar tabela de contratos após algum retorno do endPoint
        contrato tabela estava sendo atualizada antes do retorno do endPoint, causando erros.
    */
    this.dialogData = contrato;

    this.httpClient.patch(`api/${this.API_URL}/${contrato._id}`, contrato).subscribe(data => {
        // this.dialogData = contrato;
        console.log('Contrato atualizado com sucesso');
        // this.toasterService.showToaster('Successfully edited', 3000);
      },
      (err: HttpErrorResponse) => {
        console.log(`Um erro ocorreu ao atualizar contrato: ${contrato._id}, ${err.name} ${err.message}`);
        // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }

  // DELETE METHOD
  deleteContrato(_id: string): void {
    this.httpClient.delete(`api/${this.API_URL}/${_id}`).subscribe(data => {
      console.log(`Contrato apagado ${data['']}`);
      // this.toasterService.showToaster('Successfully deleted', 3000);
      },
      (err: HttpErrorResponse) => {
        // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
        console.log(`Um erro ocorreu ao apagar contrato: ${_id}, ${err.name} ${err.message}`);
      }
    );
  }
}
