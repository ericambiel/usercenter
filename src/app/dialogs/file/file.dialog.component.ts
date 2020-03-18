import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Contrato } from 'src/app/models/contrato';
import { MatTable } from '@angular/material/table';
import { FileService } from 'src/app/services/file.service';
import { HttpEvent } from '@angular/common/http';


@Component({
  selector: 'app-file',
  templateUrl: './file.dialog.component.html',
  styleUrls: ['./file.dialog.component.scss']
})
export class FileDialogComponent {

  constructor(public dialogRef: MatDialogRef<FileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dataContrato: Contrato,
              public contratoDataService: DataService,
              private FileService: FileService) { }

  @ViewChild(MatTable, {static: true}) table: MatTable<any>;

  displayedColumns = ['numAditivo',
                      'descricao',
                      'dataInsert',
                      'nome',
                      'btnActions'];

  files: Set<File>; // <...> Evita arquivos duplicados

  onSairClick(): void {
    this.dialogRef.close();
  }

  onInsertFileClick(event) {
    const selectedFiles = event.srcElement.files as FileList;
    console.log(event);

    const fileNames = [];
    this.files = new Set();

    for (let i = 0; i < selectedFiles.length; i++) {
      fileNames.push(selectedFiles[i].name); // Captura nome do arquivo
      this.files.add(selectedFiles[i]); // Adiciona o arquivo a um objeto do tipo arquivo
    }

    //Faz o upload do arquivo
    if (this.files && this.files.size > 0) {
      // TODO: Envia o arquivo para endpoint
      this.FileService.upLoadFile(this.files)
        .subscribe((event: HttpEvent<object>) => console.log('Upload Concluido'));
    }
    // document.getElementById('idDoInput').innerHTML = fileNames.join(', '); // Passa os nomes dos arquivos para algum input no HTML.
  }

  removeFile(i: number,
             nome: string) {
    // Encontra o índice do departamento a ser apagado.
    const foundIndex = this.dataContrato.documentoList.findIndex(x => x.nome === nome);
    // Utilizado splice para remover somente objeto encontrado de dentro de dataContrato
    this.dataContrato.documentoList.splice(foundIndex, 1);
    // Atualiza tabela Departamentos Participantes na tela
    this.refreshTableDeptPar();
  }

  private refreshTableDeptPar() {
    this.table.renderRows();
  }

  downloadFile(i: number,
               nome: string): void {
    this.contratoDataService.getFileContrato(nome).subscribe(res => {
      this.contratoDataService.handleFileDownload(res, nome);
    });
  }
}
