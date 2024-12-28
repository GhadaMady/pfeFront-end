import { CommonModule, NgClass } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reclamation',
  standalone: true,
  imports: [FormsModule , CommonModule, HttpClientModule],
  templateUrl: './reclamation.component.html',
  styleUrl: './reclamation.component.css'
})
export class ReclamationComponent {
  getJsonValue:any;
  dataSource :any=[];
 ngOnInit(): void {   
   this.getMothod();
 }
  getMothod(){
this.http.get('http://127.0.0.1:8800/api/reclamation').subscribe((data)=>{
 console.log(data);
 this.getJsonValue= data;
 this.dataSource=data;
})
 }

 onPut(id: string) {
  this.http.put(`http://127.0.0.1:8800/api/reclamation/${id}`, { Etat: 'Problème Résolu' }).subscribe(res => {
    console.log(res);
    window.location.reload();
  }, error => {
    console.error('Erreur lors de la validation de la réclamation :', error);
    alert('Erreur lors de la validation de la réclamation.');
  });
}

onPutC(id: string) {
  this.http.put(`http://127.0.0.1:8800/api/reclamation/${id}`, { Etat: 'En cours' }).subscribe(res => {
    console.log(res);
    window.location.reload(); 
  }, error => {
    console.error('Erreur lors de la modification de la réclamation :', error);
    alert('Erreur lors de la modification de la réclamation.');
  });
}

 
 
onDelete(id: string): void {
  // Afficher la boîte de confirmation
  const isConfirmed = confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?');

  // Si l'utilisateur confirme la suppression, procéder à la demande de suppression
  if (isConfirmed) {
    this.http.delete(`http://127.0.0.1:8800/api/reclamation/${id}`, { observe: 'response' }).subscribe(
      (res: any) => {
        if (res.status === 200) {
          // Recharger la page pour refléter les modifications
          window.location.reload();
        } else {
          alert('Erreur lors de la suppression : ' + res.message);
        }
      },
      error => {
        console.error('Erreur lors de la suppression', error);
        alert('Erreur lors de la suppression');
      }
    );
  }
}

 constructor(private http:HttpClient) {


 }

}
 
