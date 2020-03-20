import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Contrato } from 'src/app/models/contrato';
import { MatTable } from '@angular/material/table';
import { FileService } from 'src/app/services/file.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Documento } from 'src/app/models/documento';

@Component({
  selector: 'app-file',
  templateUrl: './file.dialog.component.html',
  styleUrls: ['./file.dialog.component.scss']
})
export class FileDialogComponent {

  constructor(public dialogRef: MatDialogRef<FileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dataContrato: Contrato,
              public contratoDataService: DataService,
              private fileService: FileService) { }

  @ViewChild(MatTable, {static: true}) table: MatTable<any>;

  displayedColumns = ['numAditivo',
                      'descricao',
                      'dataInsert',
                      'nome',
                      'btnActions'];

  files: Set<File>; // <...> Evita arquivos duplicados
  uploadProgress = 0;

  /**
   * Armazena arquivos em um Array para serem enviados
   * @param event Evento contendo contendo informações do arquivo.
   */
  onAdd(event) {
    const selectedFiles = event.srcElement.files as FileList;
    console.log(event);

    this.files = new Set(); // Instancia do objeto do tipo Set<File>
    const fileNames = []; // Array que contera os nomes dos arquivos

    // Add arquivo a lista para ser enviado
    for (let i = 0; i < selectedFiles.length; i++) {
      fileNames.push(selectedFiles[i].name); // Captura nome do arquivo
      this.files.add(selectedFiles[i]); // Adiciona o arquivo a um objeto do tipo arquivo
      const newDocumento = new Documento();

      newDocumento.dataInsert = new Date();
      newDocumento.descricao = selectedFiles[i].name;
      newDocumento.nome = `${this.dataContrato._id}_${selectedFiles[i].name}`;
      newDocumento.tipo = selectedFiles[i].type;

      this.dataContrato.documentoList.push(newDocumento);
      this.refreshTableDocumento();
      // TODO: Enviar no corpo o novo nome do arquivo.
    }
    this.onUploadFile(fileNames);
  }

  /** Envia arquivo ao endPoint do fileServer */
  onUploadFile(fileNames: string[]) {
    // Faz o upload do arquivo
    if (this.files && this.files.size > 0) {
      this.fileService.upLoadFile(this.files, fileNames)
        .subscribe((event: HttpEvent<object>) => {
          // console.log(event);
          if (event.type === HttpEventType.Response) {
            console.log('Upload Concluido');
          } else if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round((event.loaded * 100) / event.total);
            console.log(`${this.uploadProgress} %`);
          }
      });
    }
    // document.getElementById('idDoInput').innerHTML = fileNames.join(', '); // Passa os nomes dos arquivos para algum input no HTML.
    this.uploadProgress = 0;
  }

  onDownloadFile(i: number,
                 nome: string): void {
    this.contratoDataService.getFileContrato(nome).subscribe(res => {
      this.contratoDataService.handleFileDownload(res, nome);
    });
  }

  onRemoveFile(i: number,
               nome: string) {
    // Encontra o índice do departamento a ser apagado.
    const foundIndex = this.dataContrato.documentoList.findIndex(x => x.nome === nome);
    // Utilizado splice para remover somente objeto encontrado de dentro de dataContrato
    this.dataContrato.documentoList.splice(foundIndex, 1);
    // Atualiza tabela Departamentos Participantes na tela
    this.refreshTableDocumento();
  }

  private refreshTableDocumento() {
    this.table.renderRows();
  }

  onSairClick(): void {
    this.dialogRef.close();
  }
}
