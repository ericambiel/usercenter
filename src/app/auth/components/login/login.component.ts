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

  ngOnInit(): void {
  }

  onSubmit(fEntrar: NgForm) {
    let user = new User();
    const loginObserver = {
      next: x => this.goToHome(),
      error: err => console.error('Um erro ocorreu ao validar usuário.')
    };
    user = fEntrar.value;
    this.authService.login(user).subscribe(loginObserver);
  }

  goToHome() {
    console.log('Usuário entrou ');
    this.router.navigate(['']);
  }
}
