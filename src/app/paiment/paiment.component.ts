import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paiment',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './paiment.component.html',
  styleUrls: ['./paiment.component.css']
})
export class PaimentComponent implements OnInit {
  getJsonValue:any;
  dataSource :any=[];

 ngOnInit(): void {   
   this.getMothod();

 }
  getMothod(){
this.http.get('http://127.0.0.1:8800/api/paeiment').subscribe((data)=>{
 console.log(data);
 this.getJsonValue= data;
 this.dataSource=data;
})
 }


   
 onDelete(id: string): void {
  // Afficher la boîte de confirmation
  const isConfirmed = confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?');

  // Si l'utilisateur confirme la suppression, procéder à la demande de suppression
  if (isConfirmed) {
    this.http.delete(`http://127.0.0.1:8800/api/paeiment/${id}`, { observe: 'response' }).subscribe(
      (res: any) => {
        if (res.status === 200) {
          // Filtrer le paiement supprimé localement
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


onModify(id: string) {
  this.router.navigate(['/dashboard/paiments', 'Modifier', id]);
}


  
 constructor(private http:HttpClient , private router: Router) {


 }

}
