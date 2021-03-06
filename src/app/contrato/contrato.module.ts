/* Componentes gerais da aplicação */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Requests HTTP.
import { JwtModule } from '@auth0/angular-jwt'; // Ajudar com o JWT(helper e interceptor).
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask'; // Mascara campos, ex: CNPJ, CPF e etc.
import { NgxCurrencyModule  } from 'ngx-currency'; // Trata campos para valores moéda/currency.
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Animações dos componentes Material
import { CnpjCpfMaskPipe } from '../pipes/cnpj-cpf-mask.pipe';

/* Material Desing */
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select'; // Caixa de seleção
import { MatDatepickerModule } from '@angular/material/datepicker'; // Campo especializado em data/hora
import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatNativeDateModule } from '@angular/material/core';
// tslint:disable-next-line: max-line-length
import { MatMomentDateModule } from '@angular/material-moment-adapter'; // MatDatepickerModule(Add + opções) Erro após compilar, não abre no navegador.

/* Componentes internos Criados */
import { ContratoComponent } from './contrato.component';
import { ContratoService } from './services/contrato.service';
import { AddDialogComponent } from './components/add/add.dialog.component';
import { EditDialogComponent } from './components/edit/edit.dialog.component';
import { DeleteDialogComponent } from './components/delete/delete.dialog.component';
import { FileDialogComponent } from './components/file/file.dialog.component';

/* Rota */
import { ContratoRoutingModule } from './contrato-routing.module';

/* Configurações da mascara para campo moéda*/
const customNgxCurrencyModule = {
  align: 'left',
  allowNegative: false,
  allowZero: true,
  decimal: ',',
  precision: 2,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.',
  nullable: true
};

@NgModule({
  declarations: [
    ContratoComponent,
    AddDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent,
    FileDialogComponent,
    CnpjCpfMaskPipe
  ],
  imports: [
    HttpClientModule,
    JwtModule.forRoot({ // Intercepta requisições HttpClient e injeta JWT ao header.
      config: {
        tokenGetter: () => localStorage.getItem('Bearer')
      }
    }),
    BrowserModule,
    BrowserAnimationsModule,
    ContratoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    NgxCurrencyModule.forRoot(customNgxCurrencyModule),

    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatSelectModule,
    // MatNativeDateModule,
    MatMomentDateModule,
    MatTooltipModule
  ],
  entryComponents: [
    AddDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent
  ],
  providers: [
    ContratoService,
  ],
  exports: [ ContratoComponent ]
})
export class ContratoModule { }
