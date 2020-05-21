import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { InventoryService } from '../../service/inventory.service';

@Component({
  selector: 'app-delete-asset',
  templateUrl: './delete.dialog.component.html',
  styleUrls: ['./delete.dialog.component.scss']
})
export class DeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dataService: InventoryService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async confirmDelete(): Promise<void> {
    this.dataService.deleteAtivo(this.data.asset._id);
  }

}
