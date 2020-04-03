import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt'; // Ira verificar e decodificar o JWT enviado pelo rest
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  private jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService) { }

  /**
   * Recupera token que já foi armazenado antes pelo navegador
   * Usuário pode recarregar/navegar entre as rotas sem perde-lo.
   */
  private retrievesBrowserToken(): void {
    const token = localStorage.getItem('token');
    this.authService.decodedToken = this.jwtHelper.decodeToken(token) as User;
  }

  /** Primeiro método a ser iniciado com Angular */
  ngOnInit() {
    this.retrievesBrowserToken();
  }
}
