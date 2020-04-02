import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgForm } from '@angular/forms';
import { Auth } from '../../../models/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(fEntrar: NgForm) {
    const auth = new Auth();
    const loginObserver = {
      next: x => console.log('Usuário entrou '),
      error: err => console.error('Um erro ocorreu ao validar usuário.')
    };
    auth.user = fEntrar.value;
    this.authService.login(auth).subscribe(loginObserver);
  }
}
