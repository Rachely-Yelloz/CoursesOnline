import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { RouterLink, RouterModule } from '@angular/router';
import { response } from 'express';
import { firstValueFrom, tap, catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  userForm: FormGroup;
  errorMessage = signal<string>('');


  constructor(private fb: FormBuilder, private authService: UsersService) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

    });
  }
  ngOnInit(): void {
    this.login();
  }


 
  async login() {
    this.errorMessage.set(''); // איפוס ההודעה

    if (this.userForm.valid) {
      const userData = {
        email: this.userForm.value.email,
        password: this.userForm.value.password
      };

      try {
        const response = await firstValueFrom(
          this.authService.loginUser(userData).pipe(
            tap(res => {
              if (res?.token) {
                sessionStorage.setItem('tokenUser', res.token);
                sessionStorage.setItem('userId', res.userId);
                sessionStorage.setItem('role', res.role);
                this.errorMessage.set(''); // איפוס ההודעה במקרה של הצלחה
              }
            }),
            catchError(error => {
              console.error('Error:', error);
              this.errorMessage.set('שם משתמש או סיסמה שגויים');
              return of(null);
            })
          )
        );
      } catch (error) {
        console.error('Unexpected error:', error);
        this.errorMessage.set('שגיאה בלתי צפויה');
      }
    } else {
      this.errorMessage.set('יש למלא את כל השדות');
    }
  }

}

