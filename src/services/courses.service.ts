
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, forkJoin, map, switchMap, throwError } from 'rxjs';
import { UsersService } from './users.service';
import { Lesson } from '../models/Lesson';
import { Course } from '../models/Course'

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private apiUrl = 'http://localhost:3000/api/courses';
  private token=sessionStorage.getItem('tokenUser');

  constructor(private http: HttpClient, private usersService: UsersService) { }

  getAllCourses(): Observable<Course[]> {
    //  const token = sessionStorage.getItem('tokenUser');
    //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQxMjg3Mjc5fQ.3eK4GwZzBzil8JjNiNcZat7HMH4MFibVi7b-3rtzSq4"

    if (!this.token) {
      console.error('No token found, user might not be authenticated.');
      return new Observable<Course[]>(); // מחזיר Observable ריק אם אין טוקן
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
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

  getCourseDetailsById(id: any): Observable<Course> {

    if (!this.token) {
      console.error('No token found, user might not be authenticated.');
      return new Observable(); // מחזיר Observable ריק אם אין טוקן
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };

    return this.http.get<Course>(`${this.apiUrl}/${id}`, httpOptions).pipe(
      catchError(error => {
        console.error('Error fetching course:', error);
        return throwError(() => new Error('Failed to fetch course'));
      })
    );
  }

  getCourseLessonsById(id: any): Observable<Lesson[]> {
    //  const token = sessionStorage.getItem('tokenUser');
    //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQxMjg3Mjc5fQ.3eK4GwZzBzil8JjNiNcZat7HMH4MFibVi7b-3rtzSq4"

    if (!this.token) {
      console.error('No token found, user might not be authenticated.');
      return new Observable(); // מחזיר Observable ריק אם אין טוקן
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
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
  //  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQxMjg3Mjc5fQ.3eK4GwZzBzil8JjNiNcZat7HMH4MFibVi7b-3rtzSq4";

    if (!this.token) {
      console.error('No token found, user might not be authenticated.');
      return new Observable(); // מחזיר Observable ריק אם אין טוקן
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
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
  createLesson(courseId: number, title: string, content: string): Observable<{ message: string; lessonId: number }> {
    const url = `${this.apiUrl}/${courseId}/lessons`;
   // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQxMjg3Mjc5fQ.3eK4GwZzBzil8JjNiNcZat7HMH4MFibVi7b-3rtzSq4";

    if (!this.token) {
      console.error('No token found, user might not be authenticated.');
      return EMPTY;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      })
    };

    const body = { title, content, courseId };

    return this.http.post<{ message: string; lessonId: number }>(url, body, httpOptions);
  }

  deleteLesson(courseId: number, lessonId: number): Observable<{ message: string }> {
    const url = `${this.apiUrl}/${courseId}/lessons/${lessonId}`;
   // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQxMjg3Mjc5fQ.3eK4GwZzBzil8JjNiNcZat7HMH4MFibVi7b-3rtzSq4";

    if (!this.token) {
      console.error('No token found, user might not be authenticated.');
      return EMPTY;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
      })
    };

    return this.http.delete<{ message: string }>(url, httpOptions);
  }
  updateLesson(courseId: number, lessonId: number, title: string, content: string): Observable<{ message: string }> {
    const url = `${this.apiUrl}/${courseId}/lessons/${lessonId}`;
   // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQxMjg3Mjc5fQ.3eK4GwZzBzil8JjNiNcZat7HMH4MFibVi7b-3rtzSq4";

    if (!this.token) {
      console.error('No token found, user might not be authenticated.');
      return EMPTY;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      })
    };

    const body = { title, content, courseId };

    return this.http.put<{ message: string }>(url, body, httpOptions);
  }
  deleteCourse(courseId: number): Observable<{ message: string }> {
    const url = `${this.apiUrl}/${courseId}`;
   // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQxMjg3Mjc5fQ.3eK4GwZzBzil8JjNiNcZat7HMH4MFibVi7b-3rtzSq4";

    if (!this.token) {
      console.error('No token found, user might not be authenticated.');
      return EMPTY;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
      })
    };

    return this.http.delete<{ message: string }>(url, httpOptions);
  }
  updateCourse(courseId: number, title: string, description: string, teacherId: any): Observable<{ message: string }> {
    const url = `${this.apiUrl}/${courseId}`;
   // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQxMjg3Mjc5fQ.3eK4GwZzBzil8JjNiNcZat7HMH4MFibVi7b-3rtzSq4";

    if (!this.token) {
      console.error('No token found, user might not be authenticated.');
      return EMPTY;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      })
    };

    const body = { title, description, teacherId };

    return this.http.put<{ message: string }>(url, body, httpOptions);
  }
  createCourse(title: string, description: string, teacherId: any): Observable<{ message: string; courseId: number }> {
  //  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQxMjg3Mjc5fQ.3eK4GwZzBzil8JjNiNcZat7HMH4MFibVi7b-3rtzSq4";
    const url = this.apiUrl;

    if (!this.token) {
      console.error('No token found, user might not be authenticated.');
      return EMPTY;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      })
    };

    const body = { title, description, teacherId };

    return this.http.post<{ message: string; courseId: number }>(url, body, httpOptions);
  }
 
  removeStudentFromCourse(courseId: number, userId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.request('DELETE', `${this.apiUrl}/${courseId}/unenroll`, {
      headers,
      body: { userId }, // ודאי שה-Backend תומך ב-body ב-DELETE
    });
  }
  
}



