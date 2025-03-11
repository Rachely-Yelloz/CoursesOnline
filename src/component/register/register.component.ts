// import { Component, OnInit, signal } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { UsersService } from '../../services/users.service';
// import { firstValueFrom, tap, catchError, of } from 'rxjs';
// import { Route, Router, RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-register',
//   standalone: true, // 👈 חשוב כי יש imports
//   imports: [ReactiveFormsModule, RouterModule, CommonModule],
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css'] // 👈 תיקון
// })
// export class RegisterComponent implements OnInit {
//   userForm: FormGroup;
//   errorMessage = signal<string>(''); // הודעת שגיאה בודדת

//   constructor(private fb: FormBuilder, private authService: UsersService,private router:Router) {
//     this.userForm = this.fb.group({
//       name: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       role: ['student', Validators.required]
//     });
//   }
//   ngOnInit(): void {
//     this.register();
//   }

//   async register() {
//     this.errorMessage.set(''); // איפוס הודעות שגיאה

//     if (this.userForm.valid) {
//       const userData = {
//         name: this.userForm.value.name,
//         email: this.userForm.value.email,
//         password: this.userForm.value.password,
//         role: this.userForm.value.role
//       };

//       try {
//         const res = await firstValueFrom(
//           this.authService.registerUser(userData).pipe(
//             tap(response => {
//               if (response?.token) {
//                 sessionStorage.setItem('tokenUser', response.token);
//                 sessionStorage.setItem('userId', response.userId);
//                 sessionStorage.setItem('role', response.role);
//                 this.errorMessage.set(''); // איפוס ההודעה במקרה של הצלחה
//                 this.router.navigate(['/home']);
//               }
//             }),
//             catchError(error => {
//               console.error('Error:', error);
//               this.errorMessage.set('הרשמה נכשלה, אנא בדוק את הפרטים ונסה שוב');
//               return of(null);
//             })
//           )
//         );
//       } catch (error) {
//         console.error('Unexpected error:', error);
//         this.errorMessage.set('שגיאה בלתי צפויה');
//       }
//     } else {
//       this.errorMessage.set('נא למלא את כל השדות הנדרשים');
//     }
//   }
// }
import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { firstValueFrom, tap, catchError, of } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;
  errorMessage = signal<string>('');
  
  private fb = inject(FormBuilder);
  private authService = inject(UsersService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['student', Validators.required]
    });
  }

  ngOnInit(): void {}

  async register() {
    this.errorMessage.set('');

    if (this.userForm.valid) {
      const userData = this.userForm.value;

      try {
        const res = await firstValueFrom(
          this.authService.registerUser(userData).pipe(
            tap(response => {
              if (response?.token && isPlatformBrowser(this.platformId)) {
                sessionStorage.setItem('tokenUser', response.token);
                sessionStorage.setItem('userId', response.userId);
                sessionStorage.setItem('role', response.role);
                this.errorMessage.set('');
                this.router.navigate(['/home']);
              }
            }),
            catchError(error => {
              console.error('Error:', error);
              this.errorMessage.set('הרשמה נכשלה, אנא בדוק את הפרטים ונסה שוב');
              return of(null);
            })
          )
        );
      } catch (error) {
        console.error('Unexpected error:', error);
        this.errorMessage.set('שגיאה בלתי צפויה');
      }
    } else {
      this.errorMessage.set('נא למלא את כל השדות הנדרשים');
    }
  }
}
