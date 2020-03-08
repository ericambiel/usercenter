import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-file.dialog',
  templateUrl: './file.dialog.component.html',
  styleUrls: ['./file.dialog.component.scss']
})
export class FileDialogComponent {
  displayedColumns = ['numAditivo',
                      'dataInsert'];

  constructor(public dialogRef: MatDialogRef<FileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dataContrato: any,
              public contratoDataService: DataService) { }

  onSairClick(): void {
    this.dialogRef.close();
  }

  downloadFile(): void{
    // TODO metodo que baixa o arquivo na maquina do usuário.
  }
}
