import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { error } from 'console';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { response } from 'express';
import { Lesson } from '../../models/Lesson';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-course',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule // כאן
  ],
  templateUrl: './single-course.component.html',
  styleUrl: './single-course.component.css'
})
export class SingleCourseComponent implements OnInit {

  // courseId: string | null = null;
  @Input() courseId: string | null = null;
  courseDetails: any; // כאן תוכל להגדיר את סוג הנתונים שתקבל
  courselessons: any[] = []; // כאן תוכל להגדיר את סוג הנתונים שתקבל
  messageToPrintLesson: any;

  constructor(private route: ActivatedRoute, private coursesService: CoursesService) { }

  ngOnInit(): void {

    this.loadCourseDetails(this.courseId);
  }
  
  loadCourseDetails(id: string | null) {
    if (id) {

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
