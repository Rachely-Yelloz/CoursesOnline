import { Routes } from '@angular/router';
import { LoginComponent } from '../component/login/login.component';
import { CoursesComponent } from '../component/courses/courses.component';
import { HomeComponent } from '../component/home/home.component';
import { RegisterComponent } from '../component/register/register.component';
import { AppComponent } from './app.component';
import { SingleCourseComponent } from '../component/single-course/single-course.component';

export const routes: Routes = [
{ path: '', redirectTo: '/home', pathMatch: 'full' }, // ניתוב ברירת מחדל
{ path: 'home', component: HomeComponent }, // דף הבית

{path:'login', component:LoginComponent},
{path:'courses',component:CoursesComponent},
{path:'register',component:RegisterComponent},
{path:'course/:id',component:SingleCourseComponent}
];
