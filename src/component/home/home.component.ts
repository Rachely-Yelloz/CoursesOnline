import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-home',
  imports: [RouterLink,MatButtonModule,   MatCardModule,
        MatListModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  
  isAuth:any;
  isTeacher:any;
  ngOnInit(): void {
    this.isAuth= sessionStorage.getItem('userId');
    this.isTeacher=sessionStorage.getItem('role')==='teacher';
}}
