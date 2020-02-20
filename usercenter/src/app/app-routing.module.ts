import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasicUserInfoComponent } from './basic-user-info/basic-user-info.component';


const routes: Routes = [
  //acessa a classe BasicUserInfoComponent colocando na URL /basic-user-info
  {path: 'basic-user-info', component: BasicUserInfoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
