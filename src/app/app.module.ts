import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module'; // Import du fichier de routing

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgToastModule } from 'ng-angular-popup';

@NgModule({
  declarations: [
   
    
  ],
  imports: [
    CommonModule, 
    BrowserModule,
    FormsModule,
    HttpClientModule ,
    AppRoutingModule   ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
