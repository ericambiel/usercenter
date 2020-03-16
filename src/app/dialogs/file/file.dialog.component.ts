import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.dialog.component.html',
  styleUrls: ['./file.dialog.component.scss']
})
export class FileDialogComponent {

  constructor(public dialogRef: MatDialogRef<FileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dataContrato: any,
              public contratoDataService: DataService) { }

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

  deleteFile() {
    // TODO: Método para deletar arquivo
  }

  // TODO: Verificar porque não é exibida extensão ao baixar arquivo.
  downloadFile(i: number,
               nome: string): void {
    this.contratoDataService.getFileContrato(nome).subscribe(res => {
      const file = URL.createObjectURL(res);
      // const reader = new FileReader();
      // reader.readAsDataURL(res);
      // reader.addEventListener('load', () => {
      //   window.open(reader.result, '_blank');
      // }, false);
      window.open(file, '_blank');
    });
  }
}
