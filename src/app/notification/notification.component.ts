import { CommonModule, NgClass } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [FormsModule, CommonModule, NgClass, HttpClientModule], 
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  getJsonValue:any;
  dataSource :any=[];

 ngOnInit(): void {   
   this.getMothod();

 }
  getMothod(){
this.http.get('http://127.0.0.1:8800/api/notification').subscribe((data)=>{
 console.log(data);
 this.getJsonValue= data;
 this.dataSource=data;
})
 }


   
 onDelete(id: string): void {
  const isConfirmed = confirm('Êtes-vous sûr de vouloir supprimer cette notification ?');

  if (isConfirmed) {
    this.http.delete(`http://127.0.0.1:8800/api/notification/${id}`, { observe: 'response' }).subscribe(
      (res: any) => {
        if (res.status === 200) {
          // Filtrer la notification supprimé localement
          this.dataSource = this.dataSource.filter((item: any) => item._id !== id);
        } else {
          alert('Erreur de suppression : ' + res.message);
        }
      },
      error => {
        console.error('Erreur lors de la suppression', error);
        alert('Erreur lors de la suppression');
      }
    );
  }
}



  
 constructor(private http:HttpClient , private router: Router) {


 }
}
