
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, switchMap, throwError } from 'rxjs';
import { UsersService } from './users.service';
import { Lesson } from '../models/Lesson';

interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName?: string; // מיקום עבור שם המורה שיתווסף
}
@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private apiUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient,private usersService: UsersService) {}

  getAllCourses(): Observable<Course[]> {
  //  const token = sessionStorage.getItem('tokenUser');
  const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQxMjg3Mjc5fQ.3eK4GwZzBzil8JjNiNcZat7HMH4MFibVi7b-3rtzSq4"

    if (!token) {
      console.error('No token found, user might not be authenticated.');
      return new Observable<Course[]>(); // מחזיר Observable ריק אם אין טוקן
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.get<Course[]>(this.apiUrl, httpOptions).pipe(
      catchError(error => {
        // טיפול בשגיאה בסרוויס (לדוגמה, להחזיר שגיאה מותאמת)
        console.error('Error fetching courses:', error);
        return throwError(() => new Error('Failed to fetch courses'));
      })
    );
  }
 
  getCoursesWithTeachers(): Observable<Course[]> {
    return this.getAllCourses().pipe(
      switchMap((courses) => {
        const teacherRequests = courses.map((course) =>
          this.usersService.getUserById(course.teacherId)
        );
  
        return forkJoin(teacherRequests).pipe(
          map((teachers) =>
            courses.map((course, index) => ({
              ...course,
              teacherName: teachers[index]?.name || 'Unknown',
            }))
          )
        );
      }),
      catchError((error) => {
        console.error('Error fetching courses with teachers:', error);
        return throwError(() => new Error('Failed to fetch courses with teachers'));
      })
    );
  }
  // getCourseDetailsById(id:any): Observable<Course>{
  //     //  const token = sessionStorage.getItem('tokenUser');
  //     const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQxMjg3Mjc5fQ.3eK4GwZzBzil8JjNiNcZat7HMH4MFibVi7b-3rtzSq4"
    
  //       if (!token) {
  //         console.error('No token found, user might not be authenticated.');
  //         return new Observable(); // מחזיר Observable ריק אם אין טוקן
  //       }
    
  //       const httpOptions = {
  //         headers: new HttpHeaders({
  //           'Authorization': `Bearer ${token}`
  //         })
  //       };
  //       return this.http.get(`${this.apiUrl}/${id}`, httpOptions).pipe(
  //         catchError(error => {
  //           // טיפול בשגיאה בסרוויס (לדוגמה, להחזיר שגיאה מותאמת)
  //           console.error('Error fetching courses:', error);
  //           return throwError(() => new Error('Failed to fetch courses'));
  //         })
  //       );

  // }
  getCourseDetailsById(id: any): Observable<Course> {
    const token = "your_token_here"; // יש להחליף בטוקן האמיתי
  
    if (!token) {
      console.error('No token found, user might not be authenticated.');
      return new Observable(); // מחזיר Observable ריק אם אין טוקן
    }
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  
    return this.http.get<Course>(`${this.apiUrl}/${id}`, httpOptions).pipe(
      catchError(error => {
        console.error('Error fetching course:', error);
        return throwError(() => new Error('Failed to fetch course'));
      })
    );
  }
  
  getCourseLessonsById(id:any): Observable<Lesson[]>{
    //  const token = sessionStorage.getItem('tokenUser');
    const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQxMjg3Mjc5fQ.3eK4GwZzBzil8JjNiNcZat7HMH4MFibVi7b-3rtzSq4"
  
      if (!token) {
        console.error('No token found, user might not be authenticated.');
        return new Observable(); // מחזיר Observable ריק אם אין טוקן
      }
  
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      };
      return this.http.get<Lesson[]>(`${this.apiUrl}/${id}/lessons`, httpOptions).pipe(
        catchError(error => {
            console.error('Error fetching lessons:', error);
            return throwError(() => new Error('Failed to fetch lessons'));
        })
    );

}
  
  addStudentToCourse(courseId: any, userId: number): Observable<any> {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQxMjg3Mjc5fQ.3eK4GwZzBzil8JjNiNcZat7HMH4MFibVi7b-3rtzSq4";
  
    if (!token) {
      console.error('No token found, user might not be authenticated.');
      return new Observable(); // מחזיר Observable ריק אם אין טוקן
    }
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  
    const body = { userId: userId }; // שליחת מזהה המשתמש
  
    return this.http.post(`${this.apiUrl}/:${courseId}/enroll`, body, httpOptions).pipe(
      catchError(error => {
        console.error('Error enrolling student:', error);
        return throwError(() => new Error('Failed to enroll student'));
      })
    );
  }
  
}


