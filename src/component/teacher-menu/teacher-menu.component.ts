import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { Course } from '../../models/Course';
import { CourseToTeacherComponent } from "../course-to-teacher/course-to-teacher.component";


@Component({
  selector: 'app-teacher-menu',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule, // כאן
    CommonModule,
    CourseToTeacherComponent
],
  templateUrl: './teacher-menu.component.html',
  styleUrl: './teacher-menu.component.css'
})

export class TeacherMenuComponent {



  coursesList: any[] = [];
  idEditing: any = null;
  massageToPrint: any = null;
  newCourse: Course = {
    title: '', // תוכל להגדיר ערך ברירת מחדל כאן אם תרצה
    teacherName: '', // תוכל להגדיר ערך ברירת מחדל כאן אם תרצה
    description: '',
    teacherId: '', // תוכל להגדיר ערך ברירת מחדל כאן אם תרצה,
    id: ''
  };
  addingCourse:boolean=false;
  idChoosenToViewDetails:any;
  courseForAdding: Course = {
    title: '', // תוכל להגדיר ערך ברירת מחדל כאן אם תרצה
    description: '',
    id: '',
    teacherId: ''
  };

  constructor(private router: Router, private coursesService: CoursesService) { }
  ngOnInit(): void {
    this.loadCourses();
  }
  viewDetails(id: any) {
    this.idChoosenToViewDetails=id;
    }
  deleteCourse(id: any) {
    this.coursesService.deleteCourse(id).subscribe({
      next: (response) => {
        // אם התשובה היא חיובית, עדכון המשתנים
        this.massageToPrint = 'Course deleted successfully';
        this.coursesList = this.coursesList.filter(course => course.id !== id);
      },
      error: (err) => {
        // במקרה של שגיאה, להציג הודעת שגיאה אם צריך
        this.massageToPrint = 'Failed to delete course';
        console.error('Error deleting course:', err);
      }
    });
  }
  openAddCourse(){
    debugger;
    this.addingCourse=true;
  }
  addCourse(){
    this.coursesService.createCourse
    (this.courseForAdding.title,this.courseForAdding.description,this.courseForAdding.teacherId).subscribe({
      next: (response) => {
        // קורס נוצר בהצלחה
        this.massageToPrint = response.message; // הודעת הצלחה
        const newCourse = {
          id: response.courseId,  // ID שהשרת מחזיר
          title: this.courseForAdding.title,
          description: this.courseForAdding.description,
          teacherId: this.courseForAdding.teacherId
        };
  
        // הוספת הקורס החדש למערך הקורסים
        this.coursesList.push(newCourse);
        this.addingCourse=false;

      },
      error: (err) => {
        // במקרה של שגיאה, הצג הודעת שגיאה
        this.massageToPrint = 'Failed to create course';
        console.error('Error creating course:', err);
      }
    });
  
  }
  loadCourses(): void {
    this.coursesService.getCoursesWithTeachers().subscribe({
      next: (data) => {
        this.coursesList = data;
        // כאשר התגובה תקינה, שמים את הקורסים במערך
        console.log(data);
      },
      error: (error) => {
        this.massageToPrint = 'לא ניתן להציג את הקורסים, אנא נסה שוב מאוחר יותר';
        console.error('Error:', error);
      }
    });
  }
  updateCourse(course: any) {
    this.newCourse.description=course.description;
    this.newCourse.title=course.title;
    this.newCourse.teacherName=course.teacherName;
    this.idEditing = course.id;

  }
  saveCourse(teacherId: any, courseId: any) {
    this.coursesService.updateCourse(Number(courseId), this.newCourse.title, this.newCourse.description, teacherId).subscribe({
      next: (response) => {
        // אם התשובה היא חיובית, עדכון המשתנים
        this.massageToPrint = 'Course update successfully';
        const courseIndex = this.coursesList.findIndex(course => course.id === courseId);
        this.coursesList[courseIndex].title = this.newCourse.title;
        if (courseIndex !== -1) {
          // עדכון הערכים של הקורס במערך
          this.coursesList[courseIndex] = {
            ...this.coursesList[courseIndex], // שומרים על שדות הקורס הקיימים
            title: this.newCourse.title, // עדכון שם הקורס
            description: this.newCourse.description // עדכון תיאור הקורס
          };
        }
      },
      error: (err) => {
        // במקרה של שגיאה, להציג הודעת שגיאה אם צריך
        this.massageToPrint = 'Failed to update course';
        console.error('Error apdate course:', err);
      }
    });
  }
 
  
}
