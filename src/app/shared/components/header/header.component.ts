import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router,
              public authService: AuthService) { }

  ngOnInit(): void {
  }

  /** Sair com usuário do sistema, apaga token do navegador */
  logOut(): void {
    localStorage.removeItem('Bearer');
    this.router.navigate(['login']);
  }
}
