import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

import { AlertService } from 'ngx-alerts'; // Alertas para usuário

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() sidebar: SidebarComponent;

  constructor(private router: Router,
              public authService: AuthService,
              private alertService: AlertService) { }

  ngOnInit(): void { }

  public showAlerts(): void {
    this.alertService.warning({html: '<b>Usuário ou senha incorreto</b>'});
  }

  toggleSideBar() {
    this.sidebar.sideBarToggler();
  }

  /** Sair com usuário do sistema, apaga token do navegador */
  logOut(): void {
    localStorage.removeItem('Bearer');
    this.router.navigate(['login']);
  }
}
