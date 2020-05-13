import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  templateUrl: 'inventory.component.html',
  styleUrls: ['inventory.component.scss']
})

export class InventoryComponent implements OnInit {

  dpCapitalizedOn: Date;

  constructor() {  }

  // TODO: Criar Classe util para validação de formes
  /**
   * Descritor dos tipos de validação
   */
  formControl = new FormControl('', [
    // Validators.email,
    Validators.required
  ]);

  true = true;

  // TODO: Criar Classe util para validação de formes
  /**
   * Validação de campos obrigatórios na FORM
   */
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Campo obrigatório'
      : this.formControl.hasError('email')
        ? 'Não é um e-mail valido'
        : '';
  }

  submit() {
    console.log('submit');
  }

  onPrint() {
    console.log('imprimir');
  }

  ngOnInit(): void {
  }

}
