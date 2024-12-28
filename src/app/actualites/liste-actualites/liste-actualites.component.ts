import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import { NgForm } from '@angular/forms';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
@Component({
  selector: 'app-liste-actualites',
  standalone: true,
  imports: [NgClass  , FormsModule , CommonModule, HttpClientModule],
  templateUrl: './liste-actualites.component.html',
  styleUrl: './liste-actualites.component.css'
})
export class ListeActualitesComponent {
  dataSource: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getMothod();
  }

  getMothod() {
    this.http.get<any[]>('http://127.0.0.1:8800/api/actualite/').subscribe(
      (data: any[]) => {
        console.log(data);
        this.dataSource = data; 
        console.log('Nombre d\'actualités récupérées : ', this.dataSource.length); 
      },
      error => {
        console.log('Erreur lors de la récupération des actualités : ', error);
      }
    );
  }

  onDelete(id: string): void {
    // Afficher la boîte de confirmation
    const isConfirmed = confirm('Êtes-vous sûr de vouloir supprimer cet élément ?');
  
    // Si l'utilisateur confirme la suppression, procéder à la demande de suppression
    if (isConfirmed) {
      this.http.delete('http://127.0.0.1:8800/api/actualite/' + id, { observe: 'response' }).subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.getMothod();  // Assurez-vous que la méthode s'appelle 'getMethod' et non 'getMothod'
          } else {
            alert('Erreur : ' + res.message);
          }
        },
        error => {
          alert('Erreur lors de la suppression de l\'actualité : ' + JSON.stringify(error));
        }
      );
    }
  }
  
  chunkArray(array: any[], chunkSize: number): any[][] {
    let result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }


 
    onModify(id: string) {
      // Rediriger vers la même page avec l'ID de l'agence comme paramètre
      this.router.navigate(['/dashboard/actualites', 'Modifier', id]);
    }
  
  
}