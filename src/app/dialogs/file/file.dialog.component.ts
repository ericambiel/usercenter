import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-file.dialog',
  templateUrl: './file.dialog.component.html',
  styleUrls: ['./file.dialog.component.scss']
})
export class FileDialogComponent {

  constructor(public dialogRef: MatDialogRef<FileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dataContrato: any, public contratoDataService: DataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
