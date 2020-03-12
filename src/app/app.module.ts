/* Componentes gerais da aplicação */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Requests HTTP
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common'; // Localizar para sistema brasileiro ex: Data, moeda e etc.
import localeBr from '@angular/common/locales/pt'; // Localizar para sistema brasileiro ex: Data, moeda e etc.
import { TextMaskModule } from 'angular2-text-mask'; // Mascara campos, ex: CNPJ, CPF e etc.
import { NgxCurrencyModule  } from 'ngx-currency'; // Trata campos para valores moéda/currency.

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
import { MatDatepickerModule } from '@angular/material/datepicker'; // Campo especializado em data/hora

import { MatMomentDateModule } from '@angular/material-moment-adapter'; // Necessario para import MatDatepickerModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Animações dos componentes Material

/* Componentes internos Criados */
import { AppComponent } from './app.component';
import { DataService } from './services/data.service';
import { AddDialogComponent } from './dialogs/add/add.dialog.component';
import { EditDialogComponent } from './dialogs/edit/edit.dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.dialog.component';
import { FileDialogComponent } from './dialogs/file/file.dialog.component';

/* Configurações gerais da APP */
import { AppConfig } from '../config/app.config';

const appConfig = new AppConfig();

/* Segundo parametro 'br' é opcional, serve de apelido
para a import. Se atentar com parametr
LOCALE_ID, deve ser o mesmo importado */
registerLocaleData(localeBr, appConfig.getLocaleId());

@NgModule({
  declarations: [
    AppComponent,
    AddDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent,
    FileDialogComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    NgxCurrencyModule,
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
    MatMomentDateModule
  ],
  entryComponents: [
    AddDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent
  ],
  providers: [
    DataService,
    { provide: LOCALE_ID, useValue: appConfig.getLocaleId() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
