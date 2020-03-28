import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' } // <- Pagina inicial em /
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      // { enableTracing: true } // <-- Para Debug, apresenta informações em console do Browser
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
