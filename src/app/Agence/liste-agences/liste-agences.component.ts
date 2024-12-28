import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-liste-agences',
  standalone: true,
  imports: [NgClass  , FormsModule , CommonModule, HttpClientModule],
  templateUrl: './liste-agences.component.html',
  styleUrl: './liste-agences.component.css'
})
export class ListeAgencesComponent {
  getJsonValue:any;
  dataSource :any=[];
 ngOnInit(): void {
   this.getMothod();
 }
  getMothod(){
this.http.get('http://127.0.0.1:8800/api/agence').subscribe((data)=>{
 console.log(data);
 this.getJsonValue= data;
 this.dataSource=data;
})
 }
 
 onDelete(id: string): void {
  // Afficher la boîte de confirmation
  const isConfirmed = confirm('Êtes-vous sûr de vouloir supprimer cette agence ?');

  // Si l'utilisateur confirme la suppression, procéder à la demande de suppression
  if (isConfirmed) {
    this.http.delete(`http://127.0.0.1:8800/api/agence/${id}`, { observe: 'response' }).subscribe(
      (res: any) => {
        if (res.status === 200) {
          // Recharger la page pour refléter les modifications
          window.location.reload();
        } else {
          alert('Erreur de suppression : ' + res.message || 'Une erreur est survenue');
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
    // Rediriger vers la même page avec l'ID de l'agence comme paramètre
    this.router.navigate(['/dashboard/agences', 'Modifier', id]);
  }
 constructor(private http:HttpClient , private router : Router) {


 }

}
