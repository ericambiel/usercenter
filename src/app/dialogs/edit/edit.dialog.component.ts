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

  ////////////////////////////////// OPTIONS //////////////////////////////////////////
  // TODO: Criar um classe para segmentação.
  // TODO: Criar tabelas no banco para CRUD dos OPTIONS.
  optionsNatureza = [
    {id:  0, value: '',                       name: ''},
    {id:  1, value: 'Cliente',                name: 'Cliente'},
    {id:  2, value: 'Comodato Fornecedores',  name: 'Comodato Fornecedores'},
    {id:  3, value: 'Fornecimento',           name: 'Fornecimento'},
    {id:  4, value: 'Imobilizado',            name: 'Imobilizado'},
    {id:  5, value: 'Locação Clientes',       name: 'Locação Clientes'},
    {id:  6, value: 'Locação Fornecedores',   name: 'Locação Fornecedores'},
    {id:  7, value: 'NDA Clientes',           name: 'NDA Clientes'},
    {id:  8, value: 'NDA Fornecedores',       name: 'NDA Fornecedores'},
    {id:  9, value: 'Procuração',             name: 'Procuração'},
    {id: 10, value: 'Representação',          name: 'Representação'},
    {id: 11, value: 'Seguro',                 name: 'Seguro'},
    {id: 12, value: 'Serviços',               name: 'Serviços'}
  ];
  selectedOptionNatureza = this.optionsNatureza[0].value;

  optionsDepartamentos = [
    {id: 0, value: '',                               name: ''},
    {id: 25, value: 'Almoxarifado',                  name: 'Almoxarifado'},
    {id: 10, value: 'Contabilidade',                 name: 'Contabilidade'},
    {id: 9, value: 'Controladoria',                  name: 'Controladoria'},
    {id: 12, value: 'Crédito',                       name: 'Crédito'},
    {id: 19, value: 'Diretoria',                     name: 'Diretoria'},
    {id: 22, value: 'Expedição',                     name: 'Expedição'},
    {id: 14, value: 'Faturamento',                   name: 'Faturamento'},
    {id: 27, value: 'Faxina',                        name: 'Faxina'},
    {id: 16, value: 'Ferramental',                   name: 'Ferramental'},
    {id: 13, value: 'Financeiro',                    name: 'Financeiro'},
    {id: 11, value: 'Fiscal',                        name: 'Fiscal'},
    {id: 29, value: 'Logistica',                     name: 'Logistica'},
    {id: 18, value: 'Manutenção',                    name: 'Manutenção'},
    {id: 28, value: 'Marketing',                     name: 'Marketing'},
    {id:  8, value: 'Materiais',                     name: 'Materiais'},
    {id: 26, value: 'Motoristas',                    name: 'Motoristas'},
    {id:  3, value: 'PCP',                           name: 'PCP'},
    {id: 24, value: 'Portaria / recepção',           name: 'Portaria / recepção'},
    {id:  7, value: 'Produção',                      name: 'Produção'},
    {id: 17, value: 'Projetos',                      name: 'Projetos'},
    {id: 30, value: 'Projetos administrativos',      name: 'Projetos administrativos'},
    {id:  4, value: 'Qualidade',                     name: 'Qualidade'},
    {id: 15, value: 'R.H.',                          name: 'R.H.'},
    {id: 23, value: 'Recebimento',                   name: 'Recebimento'},
    {id: 20, value: 'Segurança do trabalho',         name: 'Segurança do trabalho'},
    {id:  5, value: 'Suprimentos',                   name: 'Suprimentos'},
    {id:  1, value: 'T.I',                           name: 'T.I'},
    {id:  6, value: 'Vendas',                        name: 'Vendas'}
  ];
  selectedoptionDepartamentos = this.optionsDepartamentos[0].value;

  optionsEstabfiscal = [
    {id:  0, value: '',                   name: ''},
    {id:  1, value: 'Alberto Santamaria', name: 'Alberto Santamaria'},
    {id:  2, value: 'Bilbao',             name: 'Bilbao'},
    {id:  3, value: 'Euskalduna',         name: 'Euskalduna'},
    {id:  4, value: 'Miguel Santamaria',  name: 'Miguel Santamaria'},
    {id:  5, value: 'Nova Tubos',         name: 'Nova Tubos'},
    {id:  6, value: 'Tubos 1020',         name: 'Tubos 1020'},
    {id:  7, value: 'Unidade 1',          name: 'Unidade 1'},
    {id:  8, value: 'Unidade 2',          name: 'Unidade 2'},
    {id:  9, value: 'Unidade 3',          name: 'Unidade 3'},
    {id: 10, value: 'Unidade 4 - TC50',   name: 'Unidade 4 - TC50'},
    {id: 11, value: 'Unidade 5 - MG',     name: 'Unidade 5 - MG'}
  ];
  selectedOptionEstabfiscal = this.optionsEstabfiscal[0].value;

  optionsIndiceReajuste = [
    {id:  0, value: '',         name: ''},
    {id:  1, value: 'IGP-DI',   name: 'IGP-DI'},
    {id:  2, value: 'IGP-M',    name: 'IGP-M'},
    {id:  3, value: 'INPC',     name: 'INPC'},
    {id:  4, value: 'IPC-A',    name: 'IPC-A'},
    {id:  5, value: 'IPC-FIPE', name: 'IPC-FIPE'}
  ];
  selectedOptionIndiceReajuste = this.optionsIndiceReajuste[0].value;

  optionsStatus = [
    {id:  0, value: '',               name: ''},
    {id:  1, value: 'Descontinuado',  name: 'Descontinuado'},
    {id:  2, value: 'Em Andamento',   name: 'Em Andamento'},
    {id:  3, value: 'Encerrado',      name: 'Encerrado'},
    {id:  4, value: 'Expirado',       name: 'Expirado'},
    {id:  5, value: 'Vigente',        name: 'Vigente'}
  ];
  selectedOptionStatus = this.optionsStatus[0].value;

  optionsSituacao = [
    {id:  0, value: '',               name: ''},
    {id:  1, value: 'Assinado',  name: 'Assinado'},
    {id:  2, value: 'Descontinuado',   name: 'Descontinuado'},
    {id:  3, value: 'Em análise do Juridico',      name: 'Em análise do Juridico'},
    {id:  4, value: 'Em análise Externa',       name: 'Em análise Externa'},
    {id:  5, value: 'Em assinaturas Externas',        name: 'Em assinaturas Externas'},
    {id:  6, value: 'Em assinaturas Internas - Alberto',        name: 'Em assinaturas Internas - Alberto'},
    {id:  7, value: 'Em assinaturas Internas - Miguel',        name: 'Em assinaturas Internas - Miguel'},
  ];
  selectedOptionSituacao = this.optionsSituacao[0].value;
 ////////////////////////////////// FIM OPTIONS //////////////////////////////////////

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

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
