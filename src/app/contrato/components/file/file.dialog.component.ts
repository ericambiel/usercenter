import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, ViewChild } from '@angular/core';
import { ContratoService } from '../../services/contrato.service';
import { Contrato } from 'src/app/models/contrato';
import { MatTable } from '@angular/material/table';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Documento } from 'src/app/models/documento';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-file-contrato',
  templateUrl: 'file.dialog.component.html',
  styleUrls: ['file.dialog.component.scss']
})
export class FileDialogComponent {
 // TODO: Verifcar meio de habilitar para edição somente quando clicar em editar contrato.
  constructor(public dialogRef: MatDialogRef<FileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dataContrato: Contrato,
              public contratoService: ContratoService,
              private fileService: FileService) { }

  @ViewChild(MatTable, {static: true}) table: MatTable<any>;

  displayedColumns = ['numAditivo',
                      'descricao',
                      'dataInsert',
                      // 'nome',
                      'btnActions'];

  files: Set<File>; // <...> Evita arquivos duplicados
  uploadProgress = 0;

  /**
   * Armazena arquivos em um Array para serem enviados
   * @param event Evento contendo informações do arquivo.
   */
  onAdd(event) {
    const selectedFiles = event.srcElement.files as FileList;
    console.log(event);

    this.files = new Set(); // Instancia do objeto do tipo Set<File>
    const fileNames = []; // Array que contera os nomes dos arquivos

    // if (!this.dataContrato.documentoList) { // Se documentoList vier sem valor "undefined"
    //      this.dataContrato.documentoList = [new Documento()]; // Atribui um array com um documento
    // }

    // Add arquivo a lista para ser enviado
    for (let i = 0; i < selectedFiles.length; i++) {
      fileNames.push(`${this.dataContrato._id}_${selectedFiles[i].name}`); // Nome que sera enviado gravado
      this.files.add(selectedFiles[i]); // Adiciona o arquivo a um objeto do tipo arquivo
      const newDocumento = new Documento();

      newDocumento.dataInsert = new Date();
      newDocumento.descricao = selectedFiles[i].name;
      newDocumento.nome = `${this.dataContrato._id}_${selectedFiles[i].name}`; // Nome que sera enviado ao BD
      newDocumento.tipo = selectedFiles[i].type;

      // Tratado em BD para nunca vir "undfined".
      // if (!this.dataContrato.documentoList) { // Se documentoList vier sem valor "undefined"
      //   this.dataContrato.documentoList = [newDocumento]; // Atribui um array com um documento
      // } else {
      this.dataContrato.documentoList.push(newDocumento); // Insere um documento no Array
      // }
      this.refreshTableDocumento();
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
    // TODO: Colocar barra de progresso ao upar arquivo para cada linha da tabela.
    // document.getElementById('idDoInput').innerHTML = fileNames.join(', '); // Passa os nomes dos arquivos para algum input no HTML.
    this.uploadProgress = 0;
  }

  onDownloadFile(i: number,
                 nome: string): void {
    this.contratoService.getFileContrato(nome).subscribe(res => {
      this.contratoService.handleFileDownload(res, nome);
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
