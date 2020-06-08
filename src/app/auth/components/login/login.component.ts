import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgForm } from '@angular/forms';
import { User } from '../../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router,
              private authService: AuthService) { }

  isLDAPServerOk = false;
  statusLDAPServer = 'Contatando servidor LDAP - Windows AD.';

  ngOnInit(): void {
    const statusLDAPServer = {
      next: res => { this.isLDAPServerOk = true; this.statusLDAPServer = 'É possível entrar com seu usuário Windows :)'; },
      error: err => this.statusLDAPServer = 'Não é possível entrar com seu usuário Windows, server Off-Line :('
    };
    this.authService.checkLDAPStatus().subscribe(statusLDAPServer);

    // TODO: NTLM, implementar no futuro
    // const loginObserver = {
    //   next: res => console.log(x),
    //   error: err => console.log(err) // Erro do retorno do end point
    // };
    // this.authService.getCurrentUser().subscribe(loginObserver);
  }

  onSubmit(fEntrar: NgForm) {
    let user = new User();
    const loginObserver = {
      next: x => this.goToHome(),
      error: err => { } // Erro do retorno do end point
    };
    user = fEntrar.value;
    this.authService.login(user).subscribe(loginObserver);
  }

  goToHome() {
    console.log('Usuário entrou');
    this.router.navigate(['/contratos']);
  }
}
