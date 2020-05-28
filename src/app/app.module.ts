/* Componentes gerais da aplicação */
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common'; // Localizar para sistema brasileiro ex: Data, moeda e etc.
import localeBr from '@angular/common/locales/pt'; // Localizar para sistema brasileiro ex: Data, moeda e etc.

/* Modulos criados compartilhados */
import { SharedModule } from './shared/shared.module'; // Ira conter módulos que serão comuns a todos como Toolbar/Sidebar
import { AuthModule } from './auth/auth.module'; // Login no sistema
import { ContratoModule } from './contrato/contrato.module'; // CRUD Contratos.
import { InventoryModule } from './inventory/inventory.module'; // Patrimônio


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

/* Configurações gerais da APP */
// import { AppConfig } from '../config/app.config.js';
// const appConfig = new AppConfig

/* Segundo parâmetro 'br' é opcional, serve de apelido
para a import. Se atentar com parâmetro
LOCALE_ID, deve ser o mesmo importado */
registerLocaleData(localeBr, 'pt'); // Onde 'pt'-> appConfig.getLocaleId()

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule,
    AuthModule,
    ContratoModule,
    InventoryModule,
    AppRoutingModule
  ],
  entryComponents: [
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' } // Onde 'pt'-> appConfig.getLocaleId()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
