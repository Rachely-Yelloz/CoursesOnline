import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { error } from 'console';

@Component({
  selector: 'app-single-course',
  imports: [],
  templateUrl: './single-course.component.html',
  styleUrl: './single-course.component.css'
})
export class SingleCourseComponent implements OnInit {
  // courseId: string | null = null;
  @Input() courseId: string | null = null;

  courseDetails: any; // כאן תוכל להגדיר את סוג הנתונים שתקבל
  courselessons:any; // כאן תוכל להגדיר את סוג הנתונים שתקבל

  constructor(private route: ActivatedRoute, private coursesService: CoursesService) { }

  ngOnInit(): void {
   // this.route.paramMap.subscribe(params => {
    //  this.courseId = params.get('id');
      this.loadCourseDetails(this.courseId);
   // });
  }

  loadCourseDetails(id: string | null) {
    if (id) {
      // this.coursesService.getCourseDetailsById(id).subscribe({
      //   next: (data) => {
      //     this.courseDetails = data;
      //     console.log(data);
          
      //     // כאן תוכל לעדכן את ה-UI עם פרטי הקורס
      //   },
      //   error: (error) => {
      //     console.error('Error loading course details:', error);
      //   }
      // });
      this.coursesService.getCourseLessonsById(id).subscribe({
        next: (data) => {
          this.courselessons = data;
          console.log(data);

        },
        error: (error) => {
          console.error('error loading ', error)
        }
      })
    }
  }
}
