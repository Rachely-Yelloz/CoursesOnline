// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { catchError, Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class UsersService {

//   private apiUrlRegister = 'http://localhost:3000/api/auth/register';
//   private apiUrlLogin = "http://localhost:3000/api/auth/login";
//   private apiUrlGetById = 'http://localhost:3000/api/users'; // URL של ה-API
//   private token=sessionStorage.getItem('tokenUser');

//   constructor(private http: HttpClient) { }

//   registerUser(userData: { name: string; email: string; password: string; role: string }): Observable<any> {
//     return this.http.post(this.apiUrlRegister, userData); // שליחת הבקשה
//   }  
//   loginUser(userData: {  email: string; password: string; }): Observable<any> {
//     return this.http.post(this.apiUrlLogin, userData); // שליחת הבקשה
//   }  
//   getUserById(userId: string): Observable<any> {
//     //const token = sessionStorage.getItem('tokenUser'); // שליפת ה-Token מה-sessionStorage
//    // const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQxMjg3Mjc5fQ.3eK4GwZzBzil8JjNiNcZat7HMH4MFibVi7b-3rtzSq4";

//     if (!this.token) {
//       console.error('No token found, user might not be authenticated.');
//       return new Observable(); // מחזיר Observable ריק אם אין טוקן
//     }

//     // יצירת כותרת Authorization עם Bearer token
//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Authorization': `Bearer ${this.token}` // שים את ה-Token בכותרת Authorization
//       })
//     };

//     // ביצוע קריאת GET עם ה-ID של המשתמש
//     return this.http.get<any>(`${this.apiUrlGetById}/${userId}`, httpOptions).pipe(
//       catchError(error => {
//         console.error('Error fetching user details:', error);
//         return new Observable(); // החזרת Observable ריק במקרה של שגיאה
//       })
//     );
//   }}
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrlRegister = 'http://localhost:3000/api/auth/register';
  private apiUrlLogin = 'http://localhost:3000/api/auth/login';
  private apiUrlGetById = 'http://localhost:3000/api/users'; // URL של ה-API

  private http = inject(HttpClient);

  private getToken(): string | null {
    if (typeof window !== 'undefined' && sessionStorage) {  // בדיקה אם אנחנו בצד הלקוח

    return sessionStorage.getItem('tokenUser');}
    return null;
  }

  registerUser(userData: { name: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post(this.apiUrlRegister, userData).pipe(
      catchError(error => {
        console.error('Error during registration:', error);
        return throwError(() => new Error('Registration failed'));
      })
    );
  }

  loginUser(userData: { email: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrlLogin, userData).pipe(
      catchError(error => {
        console.error('Error during login:', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  getUserById(userId: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      console.error('No token found, user might not be authenticated.');
      return EMPTY;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.get<any>(`${this.apiUrlGetById}/${userId}`, httpOptions).pipe(
      catchError(error => {
        console.error('Error fetching user details:', error);
        return throwError(() => new Error('Failed to fetch user details'));
      })
    );
  }
}
