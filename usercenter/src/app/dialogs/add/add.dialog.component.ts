import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {DataService} from '../../services/data.service';
import {FormControl, Validators} from '@angular/forms';
import {Contrato} from '../../models/issue';

@Component({
  selector: 'app-add.dialog',
  templateUrl: '../../dialogs/add/add.dialog.html',
  styleUrls: ['../../dialogs/add/add.dialog.css']
})

export class AddDialogComponent {
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Contrato,
              public dataService: DataService) { }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Campo obrigatório' :
      this.formControl.hasError('email') ? 'Não é um e-mail válido' :
        '';
  }

  submit() {
  // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dataService.addIssue(this.data);
  }
}
