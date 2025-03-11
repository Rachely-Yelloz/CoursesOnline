import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import { Lesson } from '../../models/Lesson';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-course-to-teacher',
  imports: [ MatButtonModule,
      MatCardModule,
      MatListModule,
      MatExpansionModule,
      ReactiveFormsModule,
      FormsModule // כאן
      ],
  templateUrl: './course-to-teacher.component.html',
  styleUrl: './course-to-teacher.component.css'
})
export class CourseToTeacherComponent implements OnInit{
   @Input() courseId: string | null = null;
    role: string | null = sessionStorage.getItem('role');
    courseDetails: any; // כאן תוכל להגדיר את סוג הנתונים שתקבל
    courselessons: any[] = []; // כאן תוכל להגדיר את סוג הנתונים שתקבל
    messageToPrintLesson: any;
    lessonToAdd: Lesson = {
      id: 0,
      title: '',
      content: '',
      courseId: 0
    }
    isAddLesson: boolean = false;
    idEditing: any;
   constructor(private route: ActivatedRoute, private coursesService: CoursesService) { }
  
    ngOnInit(): void {
  
      this.loadCourseDetails(this.courseId);
    }
  deleteLesson(idLesson: any) {
    this.coursesService.deleteLesson(Number(this.courseId), idLesson).subscribe(
      {
        next: (response) => {
          this.messageToPrintLesson = 'Lesson delete secussfuly';
          this.courselessons = this.courselessons.filter(lesson => lesson.id !== Number(idLesson));
          console.log(this.courselessons);

        },
        error: (err) => {
          this.messageToPrintLesson = 'Lesson didnt delete';
          console.error('Error deleting lesson:', err);
        }
      });
  }
  saveLesson() {
    this.coursesService.createLesson(
      Number(this.courseId),
      this.lessonToAdd.title,
      this.lessonToAdd.content
    ).subscribe({
      next: (response) => {
        this.messageToPrintLesson = 'Lesson created successfully';

        console.log({
          id: response.lessonId,
          title: this.lessonToAdd.title,
          content: this.lessonToAdd.content,
          courseId: this.courseId
        });
        
        // הוספת השיעור החדש למערך
        this.courselessons.push({
          id: response.lessonId,
          title: this.lessonToAdd.title,
          content: this.lessonToAdd.content,
          courseId: this.courseId
        });

        // איפוס השדות לאחר ההוספה
        this.lessonToAdd = {
          id: 0,
          title: '',
          content: '',
          courseId: 0
        };
        this.isAddLesson = false;
      },
      error: (err) => {
        this.messageToPrintLesson = 'Failed to create lesson';
        console.error('Error creating lesson:', err);
      }
    });
  }
  updateLesson(idLesson: any, content: any, title: any) {
    this.idEditing = idLesson;
    this.lessonToAdd.content = content;
    this.lessonToAdd.title = title;
  }
  sendUpdate(id: any) {
    this.coursesService.updateLesson(
      Number(this.courseId),
      id,
      this.lessonToAdd.title,
      this.lessonToAdd.content
    ).subscribe({
      next: (updatedLesson) => {
        // מציאת האינדקס של השיעור במערך
        const index = this.courselessons.findIndex(lesson => lesson.id === id);
        if (index !== -1) {
          // עדכון הנתונים של השיעור במערך
          this.courselessons[index].title = this.lessonToAdd.title;
          this.courselessons[index].content = this.lessonToAdd.content;
        }
        console.log('Updated lessons:', this.courselessons);
        this.idEditing='';
        this.lessonToAdd = {
          id: 0,
          title: '',
          content: '',
          courseId: 0
        };
      },
      error: (error) => {
        console.error('Error updating lesson:', error);
      }
    });
  }

  addLesson() {
    this.isAddLesson = true;
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
