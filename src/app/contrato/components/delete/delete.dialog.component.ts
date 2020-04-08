import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ContratoService } from '../../services/contrato.service';

@Component({
  selector: 'app-delete-contrato',
  templateUrl: 'delete.dialog.html',
  styleUrls: ['delete.dialog.css']
})
export class DeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dataContrato: any,
              public dataService: ContratoService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteContrato(this.dataContrato._id);
  }
}
