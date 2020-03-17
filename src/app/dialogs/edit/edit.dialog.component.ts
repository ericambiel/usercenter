import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject, ViewChild} from '@angular/core';
import {DataService} from '../../services/data.service';
import {FormControl, Validators} from '@angular/forms';
import { Contrato } from 'src/app/models/contrato';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-edit.dialog',
  templateUrl: '../../dialogs/edit/edit.dialog.html',
  styleUrls: ['../../dialogs/edit/edit.dialog.scss']
})
export class EditDialogComponent {

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dataContrato: Contrato,
              public contratoDataService: DataService) { }

  @ViewChild(MatTable, {static: true}) table: MatTable<any>;

  displayedColumns = ['departamento',
                      'btnActions'];

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  cpfCnpjMask = (varMasked: string) => {
    const withoutMask = varMasked.replace(/[^0-9]+/g, '');
    if (withoutMask.length <=  11 ) {
      return [ /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/ ];
    } else {
      return [ /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/ ];
    }
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Campo obrigatório' :
      this.formControl.hasError('email') ? 'Não é um e-mail valido' :
        '';
  }

  removeDeptoPart( i: number, departamento: string) {
    // Encontra o índice do departamento a ser apagado.
    const foundIndex = this.dataContrato.deptoPartList.findIndex(x => x.departamento === departamento);
    // Utilizado splice para remover somente objeto encontrado de dentro de dataContrato
    this.dataContrato.deptoPartList.splice(foundIndex, 1);
    // Atualiza tabela Departamentos Participantes na tela
    this.refreshTableDeptPar();
  }

  private refreshTableDeptPar() {
    this.table.renderRows();
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
