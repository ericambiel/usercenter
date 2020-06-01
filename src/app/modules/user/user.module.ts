import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { MainComponent } from './components/main/main.component';
import { LdapUsersComponent } from './components/ldap-users/ldap-users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { LDAPService } from './services/ldap.service';


@NgModule({
  declarations: [
    MainComponent,
    LdapUsersComponent ],
  imports: [
    CommonModule,
    UserRoutingModule,

    BrowserAnimationsModule,
    BrowserModule,

    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  entryComponents: [
    LdapUsersComponent ],
  providers: [
    LDAPService
  ],
  exports: [ MainComponent ]
})
export class UserModule { }
