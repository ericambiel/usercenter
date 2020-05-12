import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-column-one',
  templateUrl: './column-one.component.html',
  styleUrls: ['./column-one.component.scss']
})
export class ColumnOneComponent implements OnInit {
  // @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;

  constructor() { }

  ngOnInit(): void { }

  // Recebe o click que no menu de header e abre side nave bar
  // sideBarToggler(event: any) {
  //   this.sidenav.toggle();
  // }
}
