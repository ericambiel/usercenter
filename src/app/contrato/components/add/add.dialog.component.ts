import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {ContratoService} from '../../services/contrato.service';
import {FormControl, Validators} from '@angular/forms';
import {Contrato} from '../../../models/contrato';
import { mask } from 'src/app/libs/Mask';

@Component({
  selector: 'app-add-contrato',
  templateUrl: 'add.dialog.html',
  styleUrls: ['add.dialog.css']
})

export class AddDialogComponent {
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dataContrato: Contrato,
              public dataService: ContratoService) { }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  cpfCnpjMask = (field) => {
    return mask.maskCnpjCpf(field);
  }

  unmask(fieldMasked) {
    return mask.unmask(fieldMasked);
  }

  // Remove zeros a esquerda no inicio da digitação
  // unmask(fieldMasked): number {
  //   return Number(mask.unmask(fieldMasked.toString()));
  // }

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
    this.dataService.insertContrato(this.dataContrato);
  }
}
