import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgForm } from '@angular/forms';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import { AlertService } from 'ngx-alerts'; // Alertas para usuário

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router,
              private authService: AuthService,
              private alertService: AlertService) { }

  ngOnInit(): void {
  }

  onSubmit(fEntrar: NgForm) {
    let user = new User();
    const loginObserver = {
      next: x => this.goToHome(),
      error: err => this.showAlerts()
    };
    user = fEntrar.value;
    this.authService.login(user).subscribe(loginObserver);
  }

  goToHome() {
    console.log('Usuário entrou ');
    // this.router.navigate(['']); // Pagina principal
    this.router.navigate(['/contratos']);
  }

  showAlerts(): void {
    // this.alertService.warning({html: '<b>Usuário ou senha incorreto</b>'});
  }
}
