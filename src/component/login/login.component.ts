// import { Component, OnInit, signal } from '@angular/core';
// import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// import { UsersService } from '../../services/users.service';
// import { Router, RouterLink, RouterModule } from '@angular/router';
// import { response } from 'express';
// import { firstValueFrom, tap, catchError, of } from 'rxjs';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [ReactiveFormsModule,RouterModule,CommonModule],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })
// export class LoginComponent implements OnInit {
//   userForm: FormGroup;
//   errorMessage = signal<string>('');


//   constructor(private fb: FormBuilder, private authService: UsersService,private router:Router) {
//     this.userForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],

//     });
//   }
//   ngOnInit(): void {
//     this.login();
//   }


 
//   async login() {
//     this.errorMessage.set(''); // איפוס ההודעה

//     if (this.userForm.valid) {
//       const userData = {
//         email: this.userForm.value.email,
//         password: this.userForm.value.password
//       };

//       try {
//         const response = await firstValueFrom(
//           this.authService.loginUser(userData).pipe(
//             tap(res => {
//               if (res?.token) {
//                 sessionStorage.setItem('tokenUser', res.token);
//                 sessionStorage.setItem('userId', res.userId);
//                 sessionStorage.setItem('role', res.role);
//                 this.errorMessage.set(''); // איפוס ההודעה במקרה של הצלחה
//                 this.router.navigate(['/home']);

//               }
//             }),
//             catchError(error => {
//               console.error('Error:', error);
//               this.errorMessage.set('שם משתמש או סיסמה שגויים');
//               return of(null);
//             })
//           )
//         );
//       } catch (error) {
//         console.error('Unexpected error:', error);
//         this.errorMessage.set('שגיאה בלתי צפויה');
//       }
//     } else {
//       this.errorMessage.set('יש למלא את כל השדות');
//     }
//   }

// }

import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom, tap, catchError, of } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userForm: FormGroup;
  errorMessage = signal<string>('');

  private fb = inject(FormBuilder);
  private authService = inject(UsersService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  async login() {
    this.errorMessage.set('');

    if (this.userForm.valid) {
      const userData = this.userForm.value;

      try {
        const res = await firstValueFrom(
          this.authService.loginUser(userData).pipe(
            tap(response => {
              if (response?.token && isPlatformBrowser(this.platformId)&&sessionStorage) {
                sessionStorage.setItem('tokenUser', response.token);
                sessionStorage.setItem('userId', response.userId);
                sessionStorage.setItem('role', response.role);
                this.errorMessage.set('');
                this.router.navigate(['/home']);
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
