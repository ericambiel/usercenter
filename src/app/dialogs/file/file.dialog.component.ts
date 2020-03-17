import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Contrato } from 'src/app/models/contrato';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-file',
  templateUrl: './file.dialog.component.html',
  styleUrls: ['./file.dialog.component.scss']
})
export class FileDialogComponent {

  constructor(public dialogRef: MatDialogRef<FileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dataContrato: Contrato,
              public contratoDataService: DataService) { }

  @ViewChild(MatTable, {static: true}) table: MatTable<any>;

  displayedColumns = ['numAditivo',
                      'descricao',
                      'dataInsert',
                      'nome',
                      'btnActions'];

  onSairClick(): void {
    this.dialogRef.close();
  }

  insertFile() {
    // TODO: Método para inserir arquivos
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

  // TODO: Verificar porque não é exibida extensão ao baixar arquivo.
  downloadFile(i: number,
               nome: string): void {
    this.contratoDataService.getFileContrato(nome).subscribe(res => {
      this.contratoDataService.handleFileDownload(res, nome);
    });
  }
}
