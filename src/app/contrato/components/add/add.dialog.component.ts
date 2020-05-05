import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {ContratoService} from '../../services/contrato.service';
import {FormControl, Validators} from '@angular/forms';
import {Contrato} from '../../../models/contrato';

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

  // TODO: Criar uma classe "common" para colocar métodos incomuns
  cpfCnpjMask = (fild: string) => {
    const fildWithoutMask = fild.replace(/[^0-9]+/g, '');
    if (fildWithoutMask.length <=  11 ) {
      return [ /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/ ];
    } else {
      return [ /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/ ];
    }
  }

  unmask(fildMasked) {
    return fildMasked.replace(/\D+/g, '');
  }

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
