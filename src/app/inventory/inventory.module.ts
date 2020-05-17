import { NgModule } from '@angular/core';
import { InventoryComponent } from './inventory.component';
import { InventoryRoutingModule } from './inventory-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { InventoryService } from './service/inventory.service';


@NgModule({
  declarations: [
    InventoryComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,

    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    // MatMomentDateModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,

    InventoryRoutingModule
  ],
  providers: [
    InventoryService
  ],
  exports: [ InventoryComponent ]
})
export class InventoryModule { }
