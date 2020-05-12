import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;

  constructor() { }

  ngOnInit(): void { }

  // Recebe o click que no menu de header e abre side nave bar
  sideBarToggler() {
    this.sidenav.toggle();
  }

}
