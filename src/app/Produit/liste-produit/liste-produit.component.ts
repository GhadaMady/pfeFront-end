import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-liste-produit',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './liste-produit.component.html',
  styleUrls: ['./liste-produit.component.css']  // Corrected from styleUrl to styleUrls
})
export class ListeProduitComponent implements OnInit {  // Implement OnInit
  getJsonValue: any;
  dataSource: any = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getMothod();
  }

  getMothod() {
    this.http.get('http://127.0.0.1:8800/api/produit').subscribe((data) => {
      console.log(data);
      this.getJsonValue = data;
      this.dataSource = data;
    });
  }

  onDelete(id: string): void {
    // Afficher la boîte de confirmation
    const isConfirmed = confirm('Êtes-vous sûr de vouloir supprimer ce produit ?');
  
    // Si l'utilisateur confirme la suppression, procéder à la demande de suppression
    if (isConfirmed) {
      this.http.delete(`http://127.0.0.1:8800/api/produit/${id}`, { observe: 'response' }).subscribe(
        (res: any) => {
          if (res.status === 200) {
            // Filtrer le produit supprimé localement
            this.dataSource = this.dataSource.filter((item: any) => item._id !== id);
          } else {
            alert('Erreur de suppression : ' + res.message);
          }
        },
        error => {
          console.error('Erreur de suppression', error);
          alert('Erreur lors de la suppression');
        }
      );
    }
  }
  
  

  onModify(id: string) {
    // Rediriger vers la même page avec l'ID de l'agence comme paramètre
    this.router.navigate(['/dashboard/produits', 'Modifier', id]);
  }

}
