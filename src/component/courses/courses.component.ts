import { Component, OnInit, signal } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { Router, RouterModule } from '@angular/router';
import { SingleCourseComponent } from '../single-course/single-course.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [SingleCourseComponent, RouterModule, CommonModule],
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
  courseDetailsToShow:any;
  constructor(private router: Router, private coursesService: CoursesService) { }
  ngOnInit(): void {
    this.loadCourses();
  }
  leaveCourse(id: any) {
    console.log('leave course',id);
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
    
   // this.router.navigate(['/course', id]);

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
