import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {DataService} from '../../services/data.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit.dialog',
  templateUrl: '../../dialogs/edit/edit.dialog.html',
  styleUrls: ['../../dialogs/edit/edit.dialog.css']
})
export class EditDialogComponent {

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dataContrato: any,
              public contratoDataService: DataService) { }

  displayedColumns = ['departamento',
                      'btnActions'];

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  cpfCnpjMask = (varMasked: string) => {
    const withoutMask = varMasked.replace(/[^0-9]+/g, '');
    if (withoutMask.length <=  11 ) {
      return [ /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/ ]
    } else {
      return [ /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/ ];
    }
  }

  normalizeNumb(varMasked: string): number {
    const numb = varMasked.replace(/[^0-9]+/g, '');
    return Number(numb);
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Campo obrigatório' :
      this.formControl.hasError('email') ? 'Não é um e-mail valido' :
        '';
  }

  removeDeptoPart( i: number,
                   departamento: string) {
    // TODO: Criar metodo para remover departamento participante do contrato.
  }

  submit() {
    // emppty stuff
  }

  onCancelarClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    this.contratoDataService.updateContrato(this.dataContrato);
  }
}
