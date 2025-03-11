import { CoursesService } from '../../services/courses.service';
import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatList, MatListModule } from '@angular/material/list';
import { SingleCourseComponent } from "../single-course/single-course.component";
import { Router } from '@angular/router';


@Component({
  selector: 'app-courses',
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
    SingleCourseComponent
  ],

  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent
  implements OnInit {


  coursesList: any[] = [];
  errorMessage: string = '';
  idAddTocourse: any = null;
  addMassege = signal<string>('');
  courseIdChoosen: any;
  courseDetailsToShow: any;
  isEditing: boolean = false;
  idEditing: any;

  role: any = '';


  constructor(private router: Router, private coursesService: CoursesService) {

  }
  ngOnInit(): void {
     this.role = sessionStorage.getItem('role'); // קביעת תפקיד המשתמש
    this.loadCourses();

  }



  onSubmit() {
    console.log("editt");
  }

  deleteCourse(id: any) {
    this.coursesService.deleteCourse(id);
    this.addMassege.set('course deleted secussfuly');
    this.coursesList = this.coursesList.filter(course => course.id !== id);
  }
  leaveCourse(id: any) {
    this.coursesService.removeStudentFromCourse(Number(id),Number(sessionStorage.getItem('userId'))).subscribe({
      next: (response) => {
        this.idAddTocourse = id;
        this.addMassege.set('תלמיד הוסר בהצלחה לקורס!');
      },
      error: (error) => {
        this.addMassege.set('הסרת תלמיד מהקורס נכשלה!');
      }
    });

    console.log('leave course', id);
  }
  addToCourse(id: any) {
    // debugger;
    const userId = Number(sessionStorage.getItem('userId'));
    this.coursesService.addStudentToCourse(id, userId).subscribe({
      next: (response) => {
        this.idAddTocourse = id;
        this.addMassege.set('תלמיד נוסף בהצלחה לקורס!');
      },
      error: (error) => {
        this.addMassege.set('הוספת תלמיד לקורס נכשלה!');
      }
    });
  }

  viewDetails(id: string) {
    this.courseIdChoosen = id;
    console.log(this.courseIdChoosen);
  }
  loadCourses(): void {

    this.coursesService.getCoursesWithTeachers().subscribe({
      next: (data) => {
        this.coursesList = data;
        // כאשר התגובה תקינה, שמים את הקורסים במערך
        console.log(data);

      },
      error: (error) => {
        this.errorMessage = 'לא ניתן להציג את הקורסים, אנא נסה שוב מאוחר יותר';
        console.error('Error:', error);
      }
    });
  }


}

