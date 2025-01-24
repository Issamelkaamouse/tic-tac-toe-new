import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { initializeApp, getApp } from 'firebase/app';
import { environment } from '../environments/environment.development';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
    RouterModule,
    ReactiveFormsModule
],
    templateUrl: './app.component.html',
})
export class AppComponent {
    title = 'tictactoe-game';


}